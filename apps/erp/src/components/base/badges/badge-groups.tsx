import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  addonText?: string;
  color?: "error" | "success" | "warning" | "brand" | "gray";
  theme?: "light" | "modern";
  align?: "leading" | "trailing";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const colorStyles = {
  error: {
    wrapper: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300",
    addon: "bg-white text-rose-700 border-rose-200 shadow-xs dark:bg-rose-900 dark:text-rose-100",
  },
  success: {
    wrapper: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300",
    addon: "bg-white text-emerald-700 border-emerald-200 shadow-xs dark:bg-emerald-900 dark:text-emerald-100",
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300",
    addon: "bg-white text-amber-700 border-amber-200 shadow-xs dark:bg-amber-900 dark:text-amber-100",
  },
  brand: {
    wrapper: "bg-blue-50 border-blue-200 text-[#1F5084] dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300",
    addon: "bg-white text-[#1F5084] border-blue-200 shadow-xs dark:bg-blue-900 dark:text-blue-100",
  },
  gray: {
    wrapper: "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300",
    addon: "bg-white text-slate-700 border-slate-200 shadow-xs dark:bg-slate-800 dark:text-slate-200",
  },
};

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  addonText,
  color = "brand",
  theme = "light",
  align = "leading",
  size = "md",
  children,
  className,
  ...props
}) => {
  const styles = colorStyles[color] || colorStyles.brand;
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const renderAddon = addonText && (
    <span
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full border px-2 py-0.5",
        isLarge ? "text-xs px-2.5 py-0.5" : "text-[11px] px-2",
        styles.addon
      )}
    >
      {addonText}
    </span>
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border transition-all font-medium",
        isLarge ? "text-sm py-1 px-2.5" : "text-xs py-0.5 px-2",
        styles.wrapper,
        className
      )}
      {...props}
    >
      {align === "leading" && renderAddon}
      <span className="truncate">{children}</span>
      {align === "trailing" && renderAddon}
    </div>
  );
};

export const PillColorLeadingError = () => (
  <div className="flex flex-col items-start gap-4">
    <BadgeGroup addonText="Error" color="error" theme="light" align="leading" size="md">
      There was a problem with that action
    </BadgeGroup>
    <BadgeGroup addonText="Error" color="error" theme="light" align="leading" size="lg">
      There was a problem with that action
    </BadgeGroup>
  </div>
);

export const PillColorTrailingSuccess = () => (
  <div className="flex flex-col items-start gap-4">
    <BadgeGroup addonText="Success" color="success" theme="light" align="trailing" size="md">
      You've updated your profile and details
    </BadgeGroup>
    <BadgeGroup addonText="Success" color="success" theme="light" align="trailing" size="lg">
      You've updated your profile and details
    </BadgeGroup>
  </div>
);

export default BadgeGroup;
