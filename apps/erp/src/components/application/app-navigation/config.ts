import React from "react";

export interface NavItemSubItem {
  label: string;
  href: string;
  badge?: number | string | React.ReactNode;
}

export interface NavItemType {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode | number | string;
  items?: NavItemSubItem[];
  divider?: false;
}

export interface NavItemDividerType {
  divider: true;
  label?: never;
  href?: never;
  icon?: never;
  badge?: never;
  items?: never;
}
