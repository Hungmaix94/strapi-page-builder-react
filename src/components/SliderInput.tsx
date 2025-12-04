"use client";

import { Slider } from "./ui/slider";
import { FieldLabel } from "@measured/puck";

const SliderInput = ({
    field,
    name,
    onChange,
    value,
    defaultValue,
    readOnly,
}: {
    field: any;
    name: string;
    onChange: (value: any) => void;
    value: any;
    defaultValue?: any;
    readOnly?: boolean;
}) => {
    return (
        <FieldLabel label={`${field.label || name || ""}: ${value || defaultValue || 0}`}>
            <Slider
                min={field.min}
                max={field.max}
                step={field.step}
                defaultValue={defaultValue ? [defaultValue] : [field.min || 0]}
                onValueChange={(val) => onChange(val[0] || field.min || 0)}
                value={[value || field.min || 0]}
                disabled={readOnly || false}
            />
        </FieldLabel>
    );
};

export default SliderInput;
