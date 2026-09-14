import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface ButtonUtilityProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md";
  color?: "tertiary" | "primary" | "secondary" | "destructive";
  tooltip?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ButtonUtility = React.forwardRef<HTMLButtonElement, ButtonUtilityProps>(
  ({ size = "xs", color = "tertiary", tooltip, icon: Icon, className, children, ...props }, ref) => {
    const sizeClasses = {
      xs: "p-1 size-7 rounded-lg",
      sm: "p-1.5 size-8 rounded-lg",
      md: "p-2 size-9 rounded-lg",
    }[size];

    const iconSizes = {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-4.5",
    }[size];

    const colorClasses = {
      tertiary:
        "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm",
      secondary:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
      destructive:
        "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40",
    }[color];

    const buttonElement = (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
          sizeClasses,
          colorClasses,
          className
        )}
        aria-label={tooltip || "Action button"}
        {...props}
      >
        {Icon && <Icon className={iconSizes} />}
        {children}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger render={buttonElement} />
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    }

    return buttonElement;
  }
);
ButtonUtility.displayName = "ButtonUtility";

export default ButtonUtility;
