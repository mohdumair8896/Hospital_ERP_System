"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationCardAdvancedProps {
  align?: "center" | "start" | "end";
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function PaginationCardAdvanced({
  align = "center",
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationCardAdvancedProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const justifyClass =
    align === "center"
      ? "justify-center"
      : align === "end"
      ? "justify-end"
      : "justify-start";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 py-3 text-sm text-slate-500",
        justifyClass,
        className
      )}
    >
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canPrevious}
          aria-label="First page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!canPrevious}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                ...
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
                isCurrent
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!canNext}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          aria-label="Last page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {onPageSizeChange && (
        <div className="flex items-center space-x-2 pl-2">
          <span className="text-xs">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export const PaginationCardAdvancedCenter = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <PaginationCardAdvanced
      align="center"
      page={currentPage}
      total={10}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export interface PaginationPageMinimalCenterProps {
  page?: number;
  total?: number;
  className?: string;
  onPageChange?: (page: number) => void;
}

export const PaginationPageMinimalCenter: React.FC<PaginationPageMinimalCenterProps> = ({
  page = 1,
  total = 10,
  className,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = React.useState(page);

  const handlePrev = () => {
    const next = Math.max(1, currentPage - 1);
    setCurrentPage(next);
    onPageChange?.(next);
  };

  const handleNext = () => {
    const next = Math.min(total, currentPage + 1);
    setCurrentPage(next);
    onPageChange?.(next);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="size-4" /> Previous
      </button>
      <div className="flex items-center gap-1 font-medium">
        <span>Page</span>
        <span className="text-slate-900 dark:text-slate-100 font-semibold">{currentPage}</span>
        <span>of</span>
        <span>{total}</span>
      </div>
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= total}
        className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none"
      >
        Next <ChevronRight className="size-4" />
      </button>
    </div>
  );
};

export interface PaginationPageDefaultProps {
  page?: number;
  total?: number;
  rounded?: boolean;
  className?: string;
  onPageChange?: (page: number) => void;
}

export const PaginationPageDefault: React.FC<PaginationPageDefaultProps> = ({
  page = 1,
  total = 8,
  rounded = true,
  className,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = React.useState(page);

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-sm text-slate-500",
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          const next = Math.max(1, currentPage - 1);
          setCurrentPage(next);
          onPageChange?.(next);
        }}
        disabled={currentPage <= 1}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40",
          rounded ? "rounded-full" : "rounded-lg"
        )}
      >
        <ChevronLeft className="size-3.5" /> Previous
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const p = i + 1;
          const isSelected = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setCurrentPage(p);
                onPageChange?.(p);
              }}
              className={cn(
                "size-8 text-xs font-medium inline-flex items-center justify-center transition-colors",
                rounded ? "rounded-full" : "rounded-md",
                isSelected
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => {
          const next = Math.min(total, currentPage + 1);
          setCurrentPage(next);
          onPageChange?.(next);
        }}
        disabled={currentPage >= total}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-40",
          rounded ? "rounded-full" : "rounded-lg"
        )}
      >
        Next <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
};
