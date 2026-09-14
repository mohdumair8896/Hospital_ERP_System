"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectItemProps {
  id: string;
  children: React.ReactNode;
}

export function SelectItem({ children }: SelectItemProps) {
  return <>{children}</>;
}

export interface SelectProps<T = any> {
  "aria-label"?: string;
  size?: "sm" | "md" | "lg";
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (value: string) => void;
  items?: T[];
  children?: ((item: T) => React.ReactNode) | React.ReactNode;
  className?: string;
}

export function SelectRoot<T = any>({
  "aria-label": ariaLabel,
  size = "md",
  selectedKey: controlledKey,
  defaultSelectedKey,
  onSelectionChange,
  items,
  children,
  className,
}: SelectProps<T>) {
  const [uncontrolledKey, setUncontrolledKey] = React.useState<string>(
    defaultSelectedKey || (items && items[0] ? (items[0] as any).id : "")
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledKey !== undefined;
  const currentKey = isControlled ? controlledKey : uncontrolledKey;

  // Resolve options
  const options: { id: string; label: React.ReactNode }[] = React.useMemo(() => {
    if (items && typeof children === "function") {
      return items.map((item) => {
        const itemNode = (children as (item: T) => React.ReactElement)(item);
        return {
          id: itemNode.props.id || (item as any).id,
          label: itemNode.props.children || (item as any).label,
        };
      });
    }
    if (items) {
      return items.map((item: any) => ({
        id: item.id || item.value,
        label: item.label || item.name || item.id,
      }));
    }
    return [];
  }, [items, children]);

  const selectedOption = options.find((opt) => opt.id === currentKey) || options[0];

  const handleSelect = (id: string) => {
    if (!isControlled) setUncontrolledKey(id);
    onSelectionChange?.(id);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClass = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-10 px-3 text-xs",
    lg: "h-11 px-4 text-sm",
  }[size];

  return (
    <div ref={selectRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
          sizeClass
        )}
      >
        <span className="truncate">{selectedOption?.label || "Select option"}</span>
        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 text-xs"
        >
          {options.map((opt) => {
            const isSelected = opt.id === currentKey;
            return (
              <li
                key={opt.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 flex items-center justify-between",
                  isSelected && "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/50 dark:text-blue-300"
                )}
              >
                <span>{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
});

export default Select;
