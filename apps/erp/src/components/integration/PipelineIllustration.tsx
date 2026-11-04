import { useState } from "react"
import { ArrowRight, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"
import { demoTagClass } from "../audit/controls"
import { PIPELINE_STEPS, type PipelineStep } from "./pipeline-samples"

/** Static HL7 / FHIR walkthrough of the booking-to-billing flow. Clearly labelled as illustrative. */
export function PipelineIllustration() {
  const [selected, setSelected] = useState<PipelineStep>(PIPELINE_STEPS[0])
  const [format, setFormat] = useState<"HL7" | "FHIR">("HL7")

  return (
    <section aria-labelledby="pipeline-title" className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="pipeline-title" className="text-sm font-semibold text-foreground">Message flow walkthrough</h2>
          <span className={demoTagClass}>
            <FlaskConical className="size-3" aria-hidden="true" />
            Illustrative
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sample HL7 v2.5 and FHIR R4 messages for each step from booking to billing. These are reference examples, not live interface traffic.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Pipeline steps">
        {PIPELINE_STEPS.map((step) => {
          const active = selected.id === step.id
          return (
            <li key={step.id} className="flex">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(step)}
              className={cn(
                "flex w-full flex-col justify-between gap-3 rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted"
              )}
            >
              <div className="flex flex-col gap-1.5">
                <span className="w-fit rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
                  Step {step.stepNumber} · {step.hl7Code}
                </span>
                <span className="text-sm font-medium text-foreground">{step.title}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">{step.description}</span>
              </div>
              <span className="flex items-center gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                <span className="truncate">{step.source.split(" ")[0]}</span>
                <ArrowRight className="size-3 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">{step.destination.split(" ")[0]}</span>
              </span>
            </button>
            </li>
          )
        })}
      </ul>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 font-mono text-xs text-primary-foreground">{selected.hl7Code}</span>
              <span className="text-sm font-semibold text-foreground">{selected.title}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selected.source} → {selected.destination}
            </p>
          </div>
          <div className="inline-flex shrink-0 rounded-lg border border-border bg-muted p-0.5" role="group" aria-label="Message format">
            {(["HL7", "FHIR"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={format === f}
                onClick={() => setFormat(f)}
                className={cn(
                  "h-8 rounded-md px-3 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  format === f ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f === "HL7" ? "HL7 v2.5" : "FHIR R4"}
              </button>
            ))}
          </div>
        </div>
        <pre
          tabIndex={0}
          aria-label={`Sample ${format} message for ${selected.title}`}
          className="mt-3 max-h-80 overflow-auto whitespace-pre rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <code>{format === "HL7" ? selected.hl7Sample.replace(/\\r|\r/g, "\n") : selected.fhirJson}</code>
        </pre>
      </div>
    </section>
  )
}
