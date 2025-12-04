import * as React from "react";
import { cn } from "../../utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "pb-flex pb-h-9 pb-w-full pb-rounded-md pb-border pb-border-input pb-bg-transparent pb-px-3 pb-py-1 pb-text-base pb-shadow-sm pb-transition-colors file:pb-border-0 file:pb-bg-transparent file:pb-text-sm file:pb-font-medium file:pb-text-foreground placeholder:pb-text-muted-foreground focus-visible:pb-outline-none focus-visible:pb-ring-1 focus-visible:pb-ring-ring disabled:pb-cursor-not-allowed disabled:pb-opacity-50 md:pb-text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
