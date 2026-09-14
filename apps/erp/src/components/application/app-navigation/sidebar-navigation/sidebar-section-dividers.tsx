"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItemDividerType, NavItemType } from "../config";
import { 
  BarChartSquare02, 
  Folder, 
  HomeLine, 
  LayoutAlt01, 
  MessageChatCircle, 
  PieChart03, 
  Rows01, 
  Settings01 
} from "@/components/base/icons/untitledui";
import { BadgeWithDot } from "@/components/base/badges/badges";

export interface SidebarNavigationSectionDividersProps {
  activeUrl?: string;
  items: (NavItemType | NavItemDividerType)[];
  className?: string;
}

export const SidebarNavigationSectionDividers: React.FC<SidebarNavigationSectionDividersProps> = ({
  activeUrl = "/",
  items,
  className,
}) => {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    Folders: true,
  });

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className={cn("w-full max-w-[280px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900", className)}>
      <ul className="flex flex-col space-y-1">
        {items.map((item, index) => {
          if (item.divider) {
            return (
              <li key={`divider-${index}`} className="py-1">
                <div className="border-t border-slate-200 dark:border-slate-800" />
              </li>
            );
          }

          const hasChildren = Boolean(item.items && item.items.length > 0);
          const isOpen = Boolean(openSubMenus[item.label]);
          const isActive = activeUrl === item.href;
          const Icon = item.icon;

          return (
            <li key={item.label}>
              {hasChildren ? (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSubMenu(item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      {Icon && <Icon className="size-4 text-slate-500 dark:text-slate-400" />}
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="size-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="size-3.5 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <ul className="mt-1 space-y-0.5 pl-6">
                      {item.items?.map((sub) => (
                        <li key={sub.label}>
                          <a
                            href={sub.href}
                            className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          >
                            <span>{sub.label}</span>
                            {sub.badge !== undefined && (
                              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {sub.badge}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && (
                      <Icon
                        className={cn(
                          "size-4",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <div className="shrink-0">{item.badge}</div>
                  )}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export const navItemsWithDividers: (NavItemType | NavItemDividerType)[] = [
  {
    label: "Home",
    href: "/",
    icon: HomeLine,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChartSquare02,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: Rows01,
  },
  { divider: true },
  {
    label: "Folders",
    icon: Folder,
    href: "/folders",
    items: [
      { label: "View all", badge: 18, href: "/folders/view-all" },
      { label: "Recent", badge: 8, href: "/folders/recent" },
      { label: "Favorites", badge: 6, href: "/folders/favorites" },
      { label: "Shared", badge: 4, href: "/folders/shared" },
    ],
  },
  { divider: true },
  {
    label: "Reporting",
    href: "/reporting",
    icon: PieChart03,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings01,
  },
  {
    label: "Support",
    href: "/support",
    icon: MessageChatCircle,
    badge: (
      <BadgeWithDot color="success" type="modern" size="sm">
        Online
      </BadgeWithDot>
    ),
  },
  {
    label: "Open in browser",
    href: "https://www.untitledui.com/",
    icon: LayoutAlt01,
  },
];

export const SidebarSectionDividersDemo = () => (
  <SidebarNavigationSectionDividers activeUrl="/" items={navItemsWithDividers} />
);

export default SidebarNavigationSectionDividers;
