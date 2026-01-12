"use client";

import { processConfig, processProps } from "./utils";
import { DropZone as PuckDropZone } from "@measured/puck";
import { FieldLabel as PuckFieldLabel, walkTree as puckWalkTree } from "@measured/puck";
import { Render as PuckRender, resolveAllData as puckResolveAllData } from "@measured/puck";
import { useEffect, useMemo, useState, createContext, useCallback, useContext, useRef } from "react";
import { Puck, usePuck } from "@measured/puck";
import { useApiKeyValidation } from "./hooks/useApiKeyValidation";
import "@measured/puck/puck.css";

// Render Component
export const Render = ({
    config,
    data: { content, templateJson },
    strapi,
}: {
    config: any;
    data: { content: any; templateJson: any };
    strapi: any;
}) => {
    const [data, setData] = useState<any>(null);
    const processedConfig = useMemo(() => processConfig(strapi, config), [strapi, config]);

    useEffect(() => {
        puckResolveAllData(templateJson, processedConfig, content).then((resolvedData) => {
            setData(resolvedData);
        });
    }, [processedConfig, content, templateJson]);

    return data ? <PuckRender config={processedConfig} data={data} metadata={content} /> : null;
};

// Context
const EditorContext = createContext({
    templateJson: { content: [], root: {}, zones: {} },
    setEditorData: (_data: any, _undo: boolean, _redo: boolean) => { },
    setControls: (_undo: any, _redo: any, _toggleLeft: any, _toggleRight: any) => { },
});

const sendMessage = (message: any) => {
    if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(message, "*");
    }
};

// Editor Component
export function Editor({
    config,
    strapi,
    apiKey,
    validateApiKey = false,
}: {
    config: any;
    strapi: any;
    apiKey?: string;
    validateApiKey?: boolean;
}) {
    const validation = useApiKeyValidation(
        validateApiKey ? apiKey : undefined,
        validateApiKey ? strapi?.url : undefined
    );

    const [permissions, setPermissions] = useState({
        read: false,
        edit: false,
        modify: false,
    });
    const [metadata, setMetadata] = useState({});
    const [templateJson, setTemplateJson] = useState<any>(null);
    const [canEdit, setCanEdit] = useState(true);
    const [locale, setLocale] = useState("");
    const [enforceTemplateShape, setEnforceTemplateShape] = useState(true);

    const currentTemplateJson = useRef({});
    const undoRef = useRef(() => { });
    const redoRef = useRef(() => { });
    const toggleLeftRef = useRef(() => { });
    const toggleRightRef = useRef(() => { });

    const setControls = useCallback(
        (undo: any, redo: any, toggleLeft: any, toggleRight: any) => {
            undoRef.current = undo;
            redoRef.current = redo;
            toggleLeftRef.current = toggleLeft;
            toggleRightRef.current = toggleRight;
        },
        []
    );

    const setEditorData = (data: any, undo: boolean, redo: boolean) => {
        currentTemplateJson.current = data;
        const isDirty = JSON.stringify(data) !== JSON.stringify(templateJson);
        setTimeout(() => {
            sendMessage({
                type: "template_dirty",
                data: { dirty: isDirty, undo: undo, redo: redo },
            });
        }, 500);
    };

    const saveTemplate = useCallback(() => {
        if (currentTemplateJson.current) {
            sendMessage({
                type: "save_template",
                data: { templateJson: currentTemplateJson.current },
            });
        }
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                saveTemplate();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    redoRef.current();
                } else {
                    undoRef.current();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "y") {
                e.preventDefault();
                redoRef.current();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [saveTemplate]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case "populate": {
                    console.log("[React SDK] Received populate message:", message.data);
                    setTemplateJson(null);
                    const {
                        contentData,
                        templateJson: newTemplateJson,
                        isDefaultLocale,
                        permissions: newPermissions,
                        locale: newLocale,
                        enforceTemplateShape: newEnforceTemplateShape,
                    } = message.data;

                    setTimeout(() => {
                        console.log("[React SDK] Setting state:", { newTemplateJson, newPermissions, isDefaultLocale });
                        if (contentData) setMetadata(contentData);
                        if (newTemplateJson) setTemplateJson(newTemplateJson);
                        if (newPermissions) setPermissions(newPermissions);
                        setLocale(newLocale || "");
                        setCanEdit(isDefaultLocale);
                        setEnforceTemplateShape(newEnforceTemplateShape);
                    }, 100);
                    break;
                }
                case "save_requested": {
                    saveTemplate();
                    break;
                }
                case "undo_requested": {
                    undoRef.current();
                    break;
                }
                case "redo_requested": {
                    redoRef.current();
                    break;
                }
                case "toggle_left_requested": {
                    toggleLeftRef.current();
                    break;
                }
                case "toggle_right_requested": {
                    toggleRightRef.current();
                    break;
                }
            }
        };
        window.addEventListener("message", handleMessage);
        // Signal to parent that we are ready to receive data
        sendMessage({
            type: "child_ready",
            data: {},
        });
        return () => window.removeEventListener("message", handleMessage);
    }, [saveTemplate]);

    // Show validation error if API key validation is enabled and failed
    if (validateApiKey && !validation.loading && !validation.isValid) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{
                    maxWidth: '500px',
                    padding: '32px',
                    background: '#fee',
                    border: '2px solid #c33',
                    borderRadius: '8px'
                }}>
                    <h2 style={{ color: '#c33', marginTop: 0 }}>API Key Validation Failed</h2>
                    <p style={{ color: '#333' }}>{validation.error || 'Invalid API key'}</p>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>
                        Please check your API key configuration and try again.
                    </p>
                </div>
            </div>
        );
    }

    // Show loading state during validation
    if (validateApiKey && validation.loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div>Validating API key...</div>
            </div>
        );
    }

    return (
        <EditorContext.Provider
            value={{
                templateJson: templateJson,
                setEditorData: setEditorData,
                setControls: setControls,
            }}
        >
            <div style={{ position: "relative", width: "100vw", height: "100vh" }}>

                {templateJson && permissions.read ? (
                    <Puck
                        config={processConfig({ ...strapi, locale: locale }, config)}
                        data={{ content: [], root: {}, zones: {}, ...templateJson }}
                        metadata={metadata}
                        onPublish={() => { }}
                        overrides={{
                            header: () => <></>,
                            preview: () => <PreviewWrapper />,
                        }}
                        permissions={
                            canEdit || !enforceTemplateShape
                                ? {
                                    delete: permissions.modify,
                                    drag: permissions.modify,
                                    insert: permissions.modify,
                                    duplicate: permissions.modify,
                                    edit: permissions.edit,
                                }
                                : {
                                    delete: false,
                                    drag: false,
                                    insert: false,
                                    duplicate: false,
                                    edit: true,
                                }
                        }
                    />
                ) : null}
            </div>
        </EditorContext.Provider>
    );
}

const PreviewWrapper = ({ }) => {
    const { appState, dispatch, history } = usePuck();
    const { templateJson, setEditorData, setControls } = useContext(EditorContext);

    useEffect(() => {
        const toggleLeft = () => {
            dispatch({
                type: "setUi",
                ui: { leftSideBarVisible: !appState.ui.leftSideBarVisible },
            });
        };
        const toggleRight = () => {
            dispatch({
                type: "setUi",
                ui: { rightSideBarVisible: !appState.ui.rightSideBarVisible },
            });
        };
        setControls(
            () => history.back(),
            () => history.forward(),
            () => toggleLeft(),
            () => toggleRight()
        );
    }, [
        history.back,
        history.forward,
        appState.ui.leftSideBarVisible,
        appState.ui.rightSideBarVisible,
        setControls,
        dispatch,
    ]);

    useEffect(() => {
        if (!templateJson) return;
        const data = { ...templateJson };
        dispatch({ type: "setData", data: data });
    }, [templateJson, dispatch]);

    useEffect(() => {
        setEditorData(appState.data, history.hasPast, history.hasFuture);
    }, [appState.data, history.hasPast, history.hasFuture, setEditorData]);

    return <Puck.Preview />;
};

export const DropZone: typeof PuckDropZone = PuckDropZone;
export const FieldLabel = PuckFieldLabel;
export const walkTree = puckWalkTree;
export { processProps };
export { useApiKeyValidation };
