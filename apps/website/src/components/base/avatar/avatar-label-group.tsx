import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarLabelGroupProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  alt?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
  badge?: React.ReactNode;
}

export const AvatarLabelGroup: React.FC<AvatarLabelGroupProps> = ({
  size = "md",
  src,
  alt = "",
  title,
  subtitle,
  status,
  className,
  badge,
}) => {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <Avatar size={size} src={src} alt={alt} status={status} />
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </span>
          {badge}
        </div>
        {subtitle && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvatarLabelGroup;
