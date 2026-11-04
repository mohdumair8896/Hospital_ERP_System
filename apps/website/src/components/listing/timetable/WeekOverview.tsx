import React from 'react';
import { Check } from 'lucide-react';
import { WEEK, type ScheduleRow, type Weekday } from './schedule-model';

/**
 * "Week at a glance" table (md and up): one row per doctor, one column per
 * day, showing how many bookable times each clinic day has. The column of the
 * day selected in the tabs is highlighted.
 */
export function WeekOverview({ rows, selected, today }: { rows: ScheduleRow[]; selected: Weekday; today: Weekday | null }) {
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="week-overview-heading" className="mt-14 hidden md:block">
      <h2 id="week-overview-heading" className="font-display text-display-md text-prohealth-heading">
        Week at a glance
      </h2>
      <p className="mt-2 text-sm text-prohealth-muted">Bookable OPD times per clinic day. Choose a day above to see the times.</p>
      <div className="mt-6 overflow-hidden rounded-card border border-border bg-card shadow-soft">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th scope="col" className="w-[28%] px-5 py-3 font-semibold text-prohealth-heading">
                Doctor
              </th>
              {WEEK.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className={`px-2 py-3 text-center font-semibold ${day === selected ? 'bg-secondary text-primary' : 'text-prohealth-heading'}`}
                >
                  <abbr title={day} className="no-underline">
                    {day.slice(0, 3)}
                  </abbr>
                  {day === today && <span className="block text-[11px] font-medium text-care">Today</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const count = row.groups.reduce((n, g) => n + g.slots.length, 0);
              return (
                <tr key={row.doctor.id} className="transition-colors duration-250 hover:bg-muted/40">
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <span className="block font-semibold text-prohealth-heading">{row.doctor.name}</span>
                    <span className="block truncate text-xs text-prohealth-muted">{row.doctor.specialty}</span>
                  </th>
                  {WEEK.map((day) => {
                    const open = row.days.includes(day);
                    return (
                      <td key={day} className={`px-2 py-3 text-center ${day === selected ? 'bg-secondary/50' : ''}`}>
                        {open ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-dept-green-bg px-2 py-0.5 text-xs font-semibold text-dept-green-fg">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            {count}
                            <span className="sr-only"> {count === 1 ? 'time' : 'times'}</span>
                          </span>
                        ) : (
                          <span className="text-prohealth-muted">
                            <span aria-hidden="true">–</span>
                            <span className="sr-only">No clinic</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
