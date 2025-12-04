import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils";

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "pb-relative pb-flex pb-w-full pb-touch-none pb-select-none pb-items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="pb-relative pb-h-1.5 pb-w-full pb-grow pb-overflow-hidden pb-rounded-full pb-bg-primary/20">
            <SliderPrimitive.Range className="pb-absolute pb-h-full pb-bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="pb-block pb-h-4 pb-w-4 pb-rounded-full pb-border pb-border-primary/50 pb-bg-background pb-shadow pb-transition-colors focus-visible:pb-outline-none focus-visible:pb-ring-1 focus-visible:pb-ring-ring disabled:pb-pointer-events-none disabled:pb-opacity-50" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
