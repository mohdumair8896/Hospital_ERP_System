"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface SortDescriptor {
  column: string | number;
  direction: "ascending" | "descending";
}

interface TableContextValue {
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
}

const TableContext = React.createContext<TableContextValue>({});

export interface TableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function TableCardRoot({ className, children, ...props }: TableCardProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TableCardHeaderProps {
  title: string;
  badge?: string | React.ReactNode;
  contentTrailing?: React.ReactNode;
  description?: string;
  className?: string;
}

export function TableCardHeader({
  title,
  badge,
  contentTrailing,
  description,
  className,
}: TableCardHeaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-2 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:px-6 dark:border-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {badge && (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {badge}
          </span>
        )}
        {description && (
          <p className="text-xs text-slate-500 hidden sm:block">{description}</p>
        )}
      </div>
      {contentTrailing && <div>{contentTrailing}</div>}
    </div>
  );
}

export const TableCard = {
  Root: TableCardRoot,
  Header: TableCardHeader,
};

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  selectionMode?: "none" | "single" | "multiple";
  "aria-label"?: string;
}

export function TableRoot({
  sortDescriptor,
  onSortChange,
  className,
  children,
  ...props
}: TableProps) {
  return (
    <TableContext.Provider value={{ sortDescriptor, onSortChange }}>
      <div className="relative w-full overflow-x-auto">
        <table
          className={cn("w-full text-left text-sm border-collapse", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-slate-200 bg-slate-50/75 text-xs text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400",
        className
      )}
      {...props}
    >
      <tr>{children}</tr>
    </thead>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  id?: string;
  label?: string;
  allowsSorting?: boolean;
  isRowHeader?: boolean;
  tooltip?: string;
}

export function TableHead({
  id,
  label,
  allowsSorting,
  isRowHeader,
  tooltip,
  className,
  children,
  ...props
}: TableHeadProps) {
  const { sortDescriptor, onSortChange } = React.useContext(TableContext);

  const isSorted = sortDescriptor && sortDescriptor.column === id;
  const direction = isSorted ? sortDescriptor.direction : undefined;

  const handleClick = () => {
    if (!allowsSorting || !id || !onSortChange) return;
    const nextDirection =
      isSorted && direction === "ascending" ? "descending" : "ascending";
    onSortChange({ column: id, direction: nextDirection });
  };

  return (
    <th
      scope={isRowHeader ? "row" : "col"}
      onClick={allowsSorting ? handleClick : undefined}
      className={cn(
        "px-4 py-3 font-semibold text-xs transition-colors",
        allowsSorting && "cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{label || children}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="text-slate-400 hover:text-slate-600">
                  <HelpCircle className="size-3.5" />
                </span>
              }
            />
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
        {allowsSorting && (
          <span className="shrink-0 text-slate-400">
            {isSorted ? (
              direction === "ascending" ? (
                <ArrowUp className="size-3.5 text-blue-600 dark:text-blue-400" />
              ) : (
                <ArrowDown className="size-3.5 text-blue-600 dark:text-blue-400" />
              )
            ) : (
              <ArrowUpDown className="size-3.5 opacity-40 hover:opacity-100" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

export interface TableBodyProps<T = any>
  extends Omit<React.HTMLAttributes<HTMLTableSectionElement>, "children"> {
  items?: T[];
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}

export function TableBody<T = any>({
  items,
  children,
  className,
  ...props
}: TableBodyProps<T>) {
  let content: React.ReactNode = null;
  if (items && typeof children === "function") {
    content = items.map((item, idx) => (
      <React.Fragment key={(item as any)?.id || (item as any)?.username || idx}>
        {(children as (item: T) => React.ReactNode)(item)}
      </React.Fragment>
    ));
  } else if (typeof children !== "function") {
    content = children;
  }

  return (
    <tbody
      className={cn("divide-y divide-slate-100 dark:divide-slate-800/80 text-xs", className)}
      {...props}
    >
      {content}
    </tbody>
  );
}

export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "id"> {
  id?: string | number;
}

export function TableRow({ id, className, children, ...props }: TableRowProps) {
  return (
    <tr
      id={id !== undefined ? String(id) : undefined}
      className={cn(
        "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-slate-700 dark:text-slate-300 align-middle",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});

export default Table;
