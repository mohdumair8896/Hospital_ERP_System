import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F5084] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-[#1F5084] text-white shadow-sm hover:bg-[#164273] active:bg-[#0f2e52]",
        primary: "bg-[#1F5084] text-white shadow-sm hover:bg-[#164273] active:bg-[#0f2e52]",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800",
        "primary-destructive": "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800",
        outline: "border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
        secondary: "border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        link: "text-[#1F5084] underline-offset-4 hover:underline dark:text-blue-400 p-0 h-auto font-medium",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 rounded-lg px-4 text-sm",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  render?: React.ReactElement;
  variant?: "default" | "primary" | "destructive" | "primary-destructive" | "outline" | "secondary" | "ghost" | "link";
  color?: "primary" | "secondary" | "primary-destructive" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      color,
      size = "default",
      asChild = false,
      render,
      iconLeading,
      iconTrailing,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = (variant || color || "default") as any;
    const resolvedSize = size === "md" ? "md" : size;

    if (render) {
      return React.cloneElement(render, {
        className: cn(
          buttonVariants({ variant: resolvedVariant, size: resolvedSize }),
          className,
          render.props.className
        ),
        ref,
        ...props,
      });
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize }), className)}
        ref={ref}
        {...props}
      >
        {iconLeading && <span className="inline-flex shrink-0">{iconLeading}</span>}
        {children}
        {iconTrailing && <span className="inline-flex shrink-0">{iconTrailing}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
