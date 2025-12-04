import handlebars from "handlebars";
import React, { lazy } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper to process handlebars templates
export const processProps = (
    props: any,
    context: any
): any => {
    if (!props) return {};
    if (context) {
        return Object.entries(props).reduce((acc: any, [key, value]) => {
            if (value && typeof value === "string" && value.includes("{{") && value.includes("}}")) {
                try {
                    const compiled = handlebars.compile(value)(context);
                    acc[key] = compiled;
                } catch {
                    acc[key] = value;
                }
            } else if (value && Array.isArray(value)) {
                acc[key] = value.map((item) => processProps(item, context));
            } else if (value && typeof value === "object") {
                acc[key] = processProps(value, context);
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
    }
    return props;
};

// Lazy load components - Pointing to dist for now to maintain functionality
// You can reconstruct these components into src/components/ later
const StrapiComponent = lazy(() => import("./components/StrapiComponent"));
const ColorInput = lazy(() => import("./components/ColorInput"));
const MediaInput = lazy(() => import("./components/MediaInput"));
const RichTextInput = lazy(() => import("./components/RichTextInput"));
const SliderInput = lazy(() => import("./components/SliderInput"));

// Map field types to custom renderers
const mapFields = (field: any, config: any): any => {
    switch (field.type) {
        case "slider":
            return {
                ...field,
                type: "custom",
                _pbType: "slider",
                render: (props: any) => <SliderInput {...props} />,
            };
        case "color":
            return {
                ...field,
                type: "custom",
                _pbType: "color",
                render: (props: any) => <ColorInput {...props} />,
            };
        case "media":
            return {
                ...field,
                type: "custom",
                _pbType: "media",
                render: (props: any) => (
                    <MediaInput {...props} imageUrl={config.imageUrl} />
                ),
            };
        case "richtext":
            return {
                ...field,
                type: "custom",
                _pbType: "richtext",
                render: (props: any) => <RichTextInput {...props} />,
            };
        case "strapi":
            return {
                ...field,
                type: "custom",
                _pbType: "strapi",
                render: (props: any) => (
                    <StrapiComponent
                        {...props}
                        url={config.url}
                        authToken={config.authToken}
                        locale={config.locale}
                    />
                ),
            };
        case "array": {
            const newField = { ...field };
            for (const key in newField.arrayFields) {
                if (newField.arrayFields[key]) {
                    newField.arrayFields[key] = mapFields(newField.arrayFields[key], config);
                }
            }
            return newField;
        }
        case "object": {
            const newField = { ...field };
            for (const key in newField.objectFields) {
                if (newField.objectFields[key]) {
                    newField.objectFields[key] = mapFields(newField.objectFields[key], config);
                }
            }
            return newField;
        }
        default:
            return field;
    }
};

// Fetch Strapi data
const fetchStrapiData = async (
    config: any,
    contentType: string,
    data: any,
    populate: any
) => {
    const { documentId } = data;
    if (!config.url || !contentType || !documentId) return null;

    const collectionName =
        (contentType?.split("::")?.[1]?.split(".")?.[0] || contentType) + "s";

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const url = new URL(`${config.url}/${collectionName}/${documentId}`);

    if (populate) {
        if (Array.isArray(populate)) {
            populate.forEach((item: string) => {
                const [key, value] = item.split("=");
                if (key && value) url.searchParams.append(key, value);
            });
        } else {
            const [key, value] = populate.split("=");
            if (key && value) url.searchParams.append(key, value);
        }
    } else {
        url.searchParams.append("populate", "*");
    }

    if (config.locale) url.searchParams.append("locale", config.locale);
    if (config.authToken) headers.set("Authorization", `Bearer ${config.authToken}`);

    const response = await fetch(decodeURI(url.toString()), { headers });
    const { data: responseData } = await response.json();
    return responseData || null;
};

// Resolve data recursively
const resolveData = async (config: any, field: any, value: any): Promise<any> => {
    const isStrapi = field?.type === "strapi" || field?._pbType === "strapi";
    const isObject = field?.type === "object";
    const isArray = field?.type === "array";

    if (isStrapi) {
        try {
            return await fetchStrapiData(config, field.contentType, value, field.populate);
        } catch {
            return value;
        }
    } else if (isObject) {
        if (!field.objectFields) return value;
        const newValue: any = { ...value };
        const fieldDef = { ...field };

        for (const key in fieldDef.objectFields) {
            if (!fieldDef.objectFields[key]) continue;
            const subField = fieldDef.objectFields[key];
            const isSubStrapi = subField?.type === "strapi" || subField?._pbType === "strapi";
            const isSubObject = subField?.type === "object";
            const isSubArray = subField?.type === "array";

            if (isSubStrapi || isSubObject || isSubArray) {
                newValue[key] = (await resolveData(config, subField, value[key])) || subField;
            }
        }
        return newValue;
    } else if (isArray) {
        if (!field.arrayFields) return value;
        const newValue = [...value];
        const fieldDef = { ...field };

        for (let i = 0; i < newValue.length; i++) {
            const item = { ...newValue[i] };
            for (const key in fieldDef.arrayFields) {
                if (!fieldDef.arrayFields[key]) continue;
                const subField = fieldDef.arrayFields[key];
                const isSubStrapi = subField?.type === "strapi" || subField?._pbType === "strapi";
                const isSubObject = subField?.type === "object";
                const isSubArray = subField?.type === "array";

                if (isSubStrapi) {
                    item[key] = (await fetchStrapiData(config, subField.contentType, item[key], subField.populate)) || item[key];
                } else if (isSubObject || isSubArray) {
                    item[key] = (await resolveData(config, subField, newValue[i])) || subField;
                }
            }
            newValue[i] = item;
        }
        return newValue;
    }
    return value;
};

// Main config processor
export const processConfig = (config: any, strapiConfig: any) => {
    const newConfig = { ...strapiConfig };

    // Process components
    for (const componentName in strapiConfig.components) {
        const component = newConfig?.components?.[componentName];
        if (!component) continue;

        for (const fieldName in component.fields) {
            const field = component.fields[fieldName];
            const isStrapi = field?.type === "strapi";
            const isObject = field?.type === "object";
            const isArray = field?.type === "array";

            if (isStrapi || isObject || isArray) {
                if (!component.resolveData) {
                    component.resolveData = async (data: any, params: any) => {
                        let newData = { ...data };
                        try {
                            if (!data.props[fieldName] || !field) return data;
                            const resolved = await resolveData(config, field, data.props[fieldName]);
                            if (!resolved) return data;
                            newData = {
                                ...data,
                                props: { ...data.props, [fieldName]: resolved || data.props[fieldName] },
                            };
                        } catch (e: any) {
                            console.error(e.message);
                        }
                        return newData;
                    };
                }
            }

            if (component.fields[fieldName]) {
                component.fields[fieldName] = mapFields(component.fields[fieldName], config);
            }
        }
    }

    // Process root fields
    for (const fieldName in newConfig?.root?.fields) {
        const field = newConfig?.root?.fields[fieldName];
        if (field?.type === "strapi") {
            if (!newConfig.root) continue;
            if (!newConfig.root.resolveData) {
                newConfig.root.resolveData = async (data: any, params: any) => {
                    let newData = { ...data };
                    if (!data.props[fieldName]) return { props: data.props, readOnly: data.readOnly || {} };
                    try {
                        const resolved = await fetchStrapiData(config, field.contentType, data.props[fieldName], field.populate);
                        newData = { ...data, props: { ...data.props, [fieldName]: resolved || data.props[fieldName] } };
                    } catch (e: any) {
                        console.error(e.message);
                    }
                    return newData;
                };
            }
        }
        if (newConfig?.root?.fields[fieldName]) {
            newConfig.root.fields[fieldName] = mapFields(newConfig.root.fields[fieldName], config);
        }
    }

    return newConfig;
};
