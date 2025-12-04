import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
    "pb-inline-flex pb-items-center pb-justify-center pb-gap-2 pb-whitespace-nowrap pb-rounded-md pb-text-sm pb-font-medium pb-transition-colors focus-visible:pb-outline-none focus-visible:pb-ring-1 focus-visible:pb-ring-ring disabled:pb-pointer-events-none disabled:pb-opacity-50 [&_svg]:pb-pointer-events-none [&_svg]:pb-size-4 [&_svg]:pb-shrink-0",
    {
        variants: {
            variant: {
                default:
                    "pb-bg-primary pb-text-primary-foreground pb-shadow hover:pb-bg-primary/90",
                destructive:
                    "pb-bg-destructive pb-text-destructive-foreground pb-shadow-sm hover:pb-bg-destructive/90",
                outline:
                    "pb-border pb-border-input pb-bg-background pb-shadow-sm hover:pb-bg-accent hover:pb-text-accent-foreground",
                secondary:
                    "pb-bg-secondary pb-text-secondary-foreground pb-shadow-sm hover:pb-bg-secondary/80",
                ghost: "hover:pb-bg-accent hover:pb-text-accent-foreground",
                link: "pb-text-primary pb-underline-offset-4 hover:pb-underline",
            },
            size: {
                default: "pb-h-9 pb-px-4 pb-py-2",
                sm: "pb-h-8 pb-rounded-md pb-px-3 pb-text-xs",
                lg: "pb-h-10 pb-rounded-md pb-px-8",
                icon: "pb-h-9 pb-w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
