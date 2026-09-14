import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupContextType {
  selectedKeys?: string[];
  onSelect?: (key: string) => void;
  size?: "sm" | "md" | "lg";
}

const ButtonGroupContext = React.createContext<ButtonGroupContextType>({});

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  selectedKeys = [],
  onSelectionChange,
  size = "md",
  children,
  className,
  ...props
}) => {
  const handleSelect = (key: string) => {
    if (onSelectionChange) {
      if (selectedKeys.includes(key)) {
        onSelectionChange(selectedKeys.filter((k) => k !== key));
      } else {
        onSelectionChange([...selectedKeys, key]);
      }
    }
  };

  return (
    <ButtonGroupContext.Provider value={{ selectedKeys, onSelect: handleSelect, size }}>
      <div
        className={cn(
          "inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs dark:border-slate-800 dark:bg-slate-900",
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

export interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  iconLeading?: React.ComponentType<{ className?: string }> | React.ReactNode;
  iconTrailing?: React.ComponentType<{ className?: string }> | React.ReactNode;
  children?: React.ReactNode;
}

export const ButtonGroupItem: React.FC<ButtonGroupItemProps> = ({
  id,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { selectedKeys = [], onSelect, size = "md" } = React.useContext(ButtonGroupContext);
  const isSelected = selectedKeys.includes(id);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (onSelect) onSelect(id);
  };

  const renderIcon = (icon: any) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="size-4 shrink-0" />;
  };

  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-hidden",
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-4 py-2 text-base",
        isSelected
          ? "bg-slate-100 text-[#1F5084] font-semibold shadow-xs dark:bg-slate-800 dark:text-blue-300"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {renderIcon(IconLeading)}
      {children && <span>{children}</span>}
      {renderIcon(IconTrailing)}
    </button>
  );
};

export default ButtonGroup;
