import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single";
  selected?: Date | string | null;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  captionLayout?: "dropdown" | "buttons";
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  captionLayout = "dropdown",
  disabled,
  minDate,
  maxDate,
}: CalendarProps) {
  const selectedDate = selected instanceof Date ? selected : selected ? new Date(selected) : undefined;
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedDate || new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(parseInt(e.target.value, 10), month, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(year, parseInt(e.target.value, 10), 1));
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === d &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isToday = (d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  };

  const isDateDisabled = (d: number) => {
    const date = new Date(year, month, d);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabled && disabled(date)) return true;
    return false;
  };

  const handleDateClick = (d: number) => {
    if (isDateDisabled(d)) return;
    const newDate = new Date(year, month, d);
    if (onSelect) onSelect(newDate);
  };

  // Generate day cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push(
      <div
        key={`prev-${i}`}
        className="size-9 flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 select-none"
      >
        {prevMonthDays - i}
      </div>
    );
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const active = isSelected(d);
    const today = isToday(d);
    const isDisabled = isDateDisabled(d);

    calendarCells.push(
      <button
        key={`day-${d}`}
        type="button"
        disabled={isDisabled}
        onClick={() => handleDateClick(d)}
        className={cn(
          "size-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
          active
            ? "bg-[#1F5084] text-white font-bold shadow-sm shadow-[#1F5084]/30"
            : today
            ? "border border-[#2B78C6] text-[#1F5084] font-semibold bg-blue-50/50"
            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
          isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent text-slate-400"
        )}
      >
        {d}
      </button>
    );
  }

  // Next month leading days to complete grid
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push(
      <div
        key={`next-${i}`}
        className="size-9 flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 select-none"
      >
        {i}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-fit select-none",
        className
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {captionLayout === "dropdown" ? (
          <div className="flex items-center gap-1.5">
            <select
              value={month}
              onChange={handleMonthChange}
              className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-hidden"
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={handleYearChange}
              className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-hidden"
            >
              {Array.from({ length: 10 }, (_, i) => year - 5 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {monthNames[month]} {year}
          </span>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {dayNames.map((day) => (
          <div key={day} className="size-9 flex items-center justify-center text-[11px] font-semibold text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar dates grid */}
      <div className="grid grid-cols-7 gap-1">{calendarCells}</div>
    </div>
  );
}

export default Calendar;
