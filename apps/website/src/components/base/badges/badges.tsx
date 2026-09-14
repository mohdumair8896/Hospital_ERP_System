import * as React from "react";
import { cn } from "@/lib/utils";
import type { BadgeColor, BadgeTypes } from "./badge-types";

export type { BadgeColor, BadgeTypes };

const colorStyles: Record<string, { badge: string; dot: string }> = {
  gray: {
    badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-500 dark:bg-slate-400",
  },
  brand: {
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  success: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  error: {
    badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
    dot: "bg-rose-500 dark:bg-rose-400",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-600 dark:bg-indigo-400",
  },
  pink: {
    badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800",
    dot: "bg-pink-500 dark:bg-pink-400",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
    dot: "bg-orange-500 dark:bg-orange-400",
  },
  "blue-light": {
    badge: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
  "gray-blue": {
    badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

const sizeStyles: Record<string, string> = {
  sm: "text-xs px-2 py-0.5 gap-1.5",
  md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
  lg: "text-sm px-3 py-1.5 gap-2 font-medium",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: BadgeColor | string;
  size?: "sm" | "md" | "lg";
  type?: BadgeTypes;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  color = "gray",
  size = "sm",
  type = "modern",
  className,
  children,
  ...props
}) => {
  const current = colorStyles[color as string] || colorStyles.gray;
  const sizeClass = sizeStyles[size] || sizeStyles.sm;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        current.badge,
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BadgeWithDotProps extends BadgeProps {
  dotClassName?: string;
}

export const BadgeWithDot: React.FC<BadgeWithDotProps> = ({
  color = "gray",
  size = "sm",
  type = "modern",
  className,
  dotClassName,
  children,
  ...props
}) => {
  const current = colorStyles[color as string] || colorStyles.gray;
  const sizeClass = sizeStyles[size] || sizeStyles.sm;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        current.badge,
        sizeClass,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "size-1.5 rounded-full shrink-0 animate-pulse",
          current.dot,
          dotClassName
        )}
      />
      <span>{children}</span>
    </div>
  );
};

export default Badge;
