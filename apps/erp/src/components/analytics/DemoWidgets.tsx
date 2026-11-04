import { TrendAreaChart } from "../charts/TrendAreaChart"
import { BarList } from "./BarList"
import { WidgetCard } from "./WidgetCard"

/*
 * Metrics with no API source yet (no bed-management or billing service). They are fixed
 * illustrative numbers and are always tagged "Demo data".
 */

const WARDS = [
  { ward: "Cardiology", occupied: 38, beds: 40 },
  { ward: "Neurology", occupied: 24, beds: 28 },
  { ward: "Pediatrics", occupied: 18, beds: 24 },
  { ward: "Emergency", occupied: 14, beds: 16 },
]

const REVENUE = [
  { label: "May", value: 402000 },
  { label: "Jun", value: 418500 },
  { label: "Jul", value: 431000 },
  { label: "Aug", value: 426200 },
  { label: "Sep", value: 455800 },
  { label: "Oct", value: 482500 },
]

const usd = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 })

export function BedOccupancyWidget({ className }: { className?: string }) {
  const occupied = WARDS.reduce((s, w) => s + w.occupied, 0)
  const beds = WARDS.reduce((s, w) => s + w.beds, 0)
  return (
    <WidgetCard
      demo
      title="Bed occupancy by ward"
      description={`${occupied} of ${beds} beds occupied (${Math.round((occupied / beds) * 100)}%). Illustrative: no bed-management API yet.`}
      className={className}
    >
      <BarList
        unit="%"
        share={false}
        items={WARDS.map((w) => {
          const pct = Math.round((w.occupied / w.beds) * 100)
          return {
            key: w.ward,
            text: `${w.ward}, ${w.occupied} of ${w.beds} beds`,
            label: (
              <>
                {w.ward} <span className="text-xs text-muted-foreground">{w.occupied}/{w.beds} beds</span>
              </>
            ),
            value: pct,
            barClass: pct >= 90 ? "bg-dept-amber-fg" : "bg-primary",
          }
        })}
      />
    </WidgetCard>
  )
}

export function RevenueWidget({ className }: { className?: string }) {
  const latest = REVENUE[REVENUE.length - 1].value
  return (
    <WidgetCard
      demo
      title="Clinical revenue by month"
      description="Illustrative: there is no billing API yet."
      className={className}
    >
      <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">{usd.format(latest)}</p>
      <p className="text-xs text-muted-foreground">October, month to date</p>
      <div className="mt-3">
        <TrendAreaChart data={REVENUE} format={(v) => usd.format(v)} height={150} />
      </div>
    </WidgetCard>
  )
}
