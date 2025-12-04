"use client";

import React, { lazy, Suspense } from "react";
import { FieldLabel } from "@measured/puck";

const BlocksEditor = lazy(() => import("./BlocksEditor"));

const initialValue = [
    {
        type: "paragraph",
        children: [{ type: "text", text: "A line of text in a paragraph." }],
    },
];

const RichTextInput = ({
    field,
    name,
    id,
    value,
    onChange,
    defaultValue = initialValue,
    readOnly,
}: {
    field: any;
    name: string;
    id?: string;
    value: any;
    onChange: (value: any) => void;
    defaultValue?: any;
    readOnly?: boolean;
}) => {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <BlocksEditor
                field={field}
                name={name}
                value={value || defaultValue}
                onChange={(val: any) => {
                    onChange(val);
                }}
                disabled={readOnly}
            />
        </Suspense>
    );
};

export default RichTextInput;
