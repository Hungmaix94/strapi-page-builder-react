import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../../utils";

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "pb-flex pb-h-full pb-w-full pb-flex-col pb-overflow-hidden pb-rounded-md pb-bg-popover pb-text-popover-foreground",
            className
        )}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="pb-flex pb-items-center pb-border-b pb-px-3" cmdk-input-wrapper="">
        <Search className="pb-mr-2 pb-h-4 pb-w-4 pb-shrink-0 pb-opacity-50" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "pb-flex pb-h-10 pb-w-full pb-rounded-md pb-bg-transparent pb-py-3 pb-text-sm pb-outline-none placeholder:pb-text-muted-foreground disabled:pb-cursor-not-allowed disabled:pb-opacity-50",
                className
            )}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("pb-max-h-[300px] pb-overflow-y-auto pb-overflow-x-hidden", className)}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="pb-py-6 pb-text-center pb-text-sm"
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "pb-overflow-hidden pb-p-1 pb-text-foreground [&_[cmdk-group-heading]]:pb-px-2 [&_[cmdk-group-heading]]:pb-py-1.5 [&_[cmdk-group-heading]]:pb-text-xs [&_[cmdk-group-heading]]:pb-font-medium [&_[cmdk-group-heading]]:pb-text-muted-foreground",
            className
        )}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("pb--mx-1 pb-h-px pb-bg-border", className)}
        {...props}
    />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "pb-relative pb-flex pb-cursor-default pb-gap-2 pb-select-none pb-items-center pb-rounded-sm pb-px-2 pb-py-1.5 pb-text-sm pb-outline-none data-[disabled=true]:pb-pointer-events-none data-[selected=true]:pb-bg-accent data-[selected=true]:pb-text-accent-foreground data-[disabled=true]:pb-opacity-50 [&_svg]:pb-pointer-events-none [&_svg]:pb-size-4 [&_svg]:pb-shrink-0",
            className
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "pb-ml-auto pb-text-xs pb-tracking-widest pb-text-muted-foreground",
                className
            )}
            {...props}
        />
    );
};
CommandShortcut.displayName = "CommandShortcut";

export {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};
