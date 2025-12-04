"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../utils";
import { FieldLabel } from "@measured/puck";
import { forwardRef, useMemo, useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Palette } from "lucide-react";

// Helper for forwarding refs
function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
    const innerRef = useRef<T>(null);
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }
    });
    return innerRef;
}

const ColorPicker = forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
        value?: string;
        onChange: (value: string) => void;
    }
>(({ disabled, value, onChange, onBlur, name, className, ...props }, ref) => {
    const forwardedRef = useForwardedRef(ref);
    const [open, setOpen] = useState(false);
    const color = useMemo(() => value || "#FFFFFF", [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
                <Button
                    {...props}
                    className={cn("block", className)}
                    name={name}
                    onClick={() => {
                        setOpen(true);
                    }}
                    size="icon"
                    style={{ backgroundColor: color }}
                    variant="outline"
                >
                    <div />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <HexColorPicker color={color} onChange={onChange} />
                <Input
                    maxLength={7}
                    onChange={(e) => {
                        onChange(e?.currentTarget?.value);
                    }}
                    ref={forwardedRef}
                    value={color}
                />
            </PopoverContent>
        </Popover>
    );
});
ColorPicker.displayName = "ColorPicker";

const ColorInput = ({
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
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <FieldLabel
                label={field.label || name || ""}
                icon={<Palette height={16} width={16} />}
            />
            <ColorPicker
                onChange={(u) => onChange(u)}
                value={value || ""}
                defaultValue={defaultValue || ""}
                disabled={readOnly || false}
            />
        </div>
    );
};

export default ColorInput;
