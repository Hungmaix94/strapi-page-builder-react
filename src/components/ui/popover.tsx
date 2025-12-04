import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "pb-z-50 pb-w-72 pb-rounded-md pb-border pb-bg-popover pb-p-4 pb-text-popover-foreground pb-shadow-md pb-outline-none data-[state=open]:pb-animate-in data-[state=closed]:pb-animate-out data-[state=closed]:pb-fade-out-0 data-[state=open]:pb-fade-in-0 data-[state=closed]:pb-zoom-out-95 data-[state=open]:pb-zoom-in-95 data-[side=bottom]:pb-slide-in-from-top-2 data-[side=left]:pb-slide-in-from-right-2 data-[side=right]:pb-slide-in-from-left-2 data-[side=top]:pb-slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
