"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  selectedTab: "all",
  onSelectTab: () => {},
});

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab?: string;
  selectedTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({
  defaultTab = "all",
  selectedTab: controlledTab,
  onTabChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledTab, setUncontrolledTab] = React.useState(defaultTab);
  const isControlled = controlledTab !== undefined;
  const currentTab = isControlled ? controlledTab : uncontrolledTab;

  const handleSelect = (id: string) => {
    if (!isControlled) setUncontrolledTab(id);
    onTabChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ selectedTab: currentTab, onSelectTab: handleSelect }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  type?: "underline" | "pill" | "button";
  size?: "sm" | "md" | "lg";
}

export function TabList({
  items,
  type = "underline",
  size = "md",
  className,
  ...props
}: TabListProps) {
  const { selectedTab, onSelectTab } = React.useContext(TabsContext);

  const sizeClasses = {
    sm: "text-xs py-2 px-2.5 gap-1.5",
    md: "text-xs py-2.5 px-3 gap-2",
    lg: "text-sm py-3 px-3.5 gap-2.5",
  }[size];

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-slate-200 dark:border-slate-800",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isSelected = selectedTab === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectTab(item.id)}
            className={cn(
              "relative font-semibold transition-all whitespace-nowrap focus-visible:outline-none",
              sizeClasses,
              type === "underline" && [
                isSelected
                  ? "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              ],
              type === "pill" && [
                "rounded-lg",
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
              ]
            )}
          >
            {item.label}
            {item.badge !== undefined && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isSelected
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
