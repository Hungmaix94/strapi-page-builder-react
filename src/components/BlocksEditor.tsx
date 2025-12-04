"use client";

import React, {
    useCallback,
    useMemo,
    useState,
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef,
} from "react";
import { createEditor, Transforms, Editor, Element as SlateElement, Text } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Quote,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Type,
} from "lucide-react";
import { FieldLabel } from "@measured/puck";
import { Button } from "./ui/button";
import { cn } from "../utils";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";

// --- Types ---
type CustomElement = { type: string; children: CustomText[];[key: string]: any };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean;[key: string]: any };

declare module "slate" {
    interface CustomTypes {
        Editor: ReactEditor & Editor;
        Element: CustomElement;
        Text: CustomText;
    }
}

// --- Utils ---
const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? (marks as any)[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: Editor, format: string) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
        })
    );

    return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = ["list-ordered", "list-unordered"].includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            ["list-ordered", "list-unordered"].includes(n.type),
        split: true,
    });

    const newProperties: Partial<CustomElement> = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes<CustomElement>(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

// --- Components ---

const Element = ({ attributes, children, element }: any) => {
    switch (element.type) {
        case "heading-one":
            return <h1 {...attributes} className="pb-text-4xl pb-font-bold pb-mb-4">{children}</h1>;
        case "heading-two":
            return <h2 {...attributes} className="pb-text-3xl pb-font-bold pb-mb-3">{children}</h2>;
        case "heading-three":
            return <h3 {...attributes} className="pb-text-2xl pb-font-bold pb-mb-3">{children}</h3>;
        case "heading-four":
            return <h4 {...attributes} className="pb-text-xl pb-font-bold pb-mb-2">{children}</h4>;
        case "heading-five":
            return <h5 {...attributes} className="pb-text-lg pb-font-bold pb-mb-2">{children}</h5>;
        case "heading-six":
            return <h6 {...attributes} className="pb-text-base pb-font-bold pb-mb-2">{children}</h6>;
        case "list-unordered":
            return <ul {...attributes} className="pb-list-disc pb-pl-5 pb-mb-4">{children}</ul>;
        case "list-ordered":
            return <ol {...attributes} className="pb-list-decimal pb-pl-5 pb-mb-4">{children}</ol>;
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "quote":
            return <blockquote {...attributes} className="pb-border-l-4 pb-pl-4 pb-italic pb-mb-4">{children}</blockquote>;
        case "link":
            return (
                <a {...attributes} href={element.url} className="pb-text-blue-600 pb-underline">
                    {children}
                </a>
            );
        default:
            return <p {...attributes} className="pb-mb-2">{children}</p>;
    }
};

const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon: Icon }: { format: string; icon: any }) => {
    const editor = useSlate();
    const isActive = isBlockActive(editor, format);
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
            className="pb-h-8 pb-w-8"
        >
            <Icon className="pb-h-4 pb-w-4" />
        </Button>
    );
};

const MarkButton = ({ format, icon: Icon }: { format: string; icon: any }) => {
    const editor = useSlate();
    const isActive = isMarkActive(editor, format);
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
            className="pb-h-8 pb-w-8"
        >
            <Icon className="pb-h-4 pb-w-4" />
        </Button>
    );
};

const Toolbar = () => {
    return (
        <div className="pb-flex pb-flex-wrap pb-gap-1 pb-p-2 pb-border-b pb-bg-muted/20">
            <MarkButton format="bold" icon={Bold} />
            <MarkButton format="italic" icon={Italic} />
            <MarkButton format="underline" icon={Underline} />
            <div className="pb-w-px pb-h-6 pb-bg-border pb-mx-1" />
            <BlockButton format="heading-one" icon={Heading1} />
            <BlockButton format="heading-two" icon={Heading2} />
            <BlockButton format="heading-three" icon={Heading3} />
            <div className="pb-w-px pb-h-6 pb-bg-border pb-mx-1" />
            <BlockButton format="list-unordered" icon={List} />
            <BlockButton format="list-ordered" icon={ListOrdered} />
            <BlockButton format="quote" icon={Quote} />
        </div>
    );
};

// --- Main Editor ---

export const BlocksEditor = forwardRef(
    ({ field, disabled = false, name, onChange, value, error, ...props }: any, ref) => {
        const editor = useMemo(() => withHistory(withReact(createEditor())), []);
        const renderElement = useCallback((props: any) => <Element {...props} />, []);
        const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

        return (
            <FieldLabel label={field.label || ""} icon={<Type height={16} width={16} />}>
                <div className={cn("pb-border pb-rounded-md pb-overflow-hidden", error ? "pb-border-red-500" : "pb-border-input")}>
                    <Slate
                        editor={editor}
                        initialValue={value || [{ type: "paragraph", children: [{ text: "" }] }]}
                        onChange={(val) => {
                            const isAstChange = editor.operations.some(
                                (op) => "set_selection" !== op.type
                            );
                            if (isAstChange) {
                                onChange(val);
                            }
                        }}
                    >
                        {!disabled && <Toolbar />}
                        <div className="pb-p-4 pb-min-h-[150px]">
                            <Editable
                                readOnly={disabled}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                placeholder="Enter some rich text..."
                                className="pb-outline-none"
                            />
                        </div>
                    </Slate>
                </div>
                {error && <span className="pb-text-xs pb-text-red-500">{error}</span>}
            </FieldLabel>
        );
    }
);

BlocksEditor.displayName = "BlocksEditor";

export default BlocksEditor;
