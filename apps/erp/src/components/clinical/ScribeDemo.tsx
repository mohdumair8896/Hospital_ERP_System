import { useEffect, useRef, useState } from "react"
import { FlaskConical, X } from "lucide-react"
import { VITAL_SPECS, SOAP_SECTIONS, vitalFlag, type EncounterDraft, type SoapSectionKey } from "./encounter-model"

type ScribeDraft = Record<SoapSectionKey, string>

/**
 * Builds a SOAP skeleton from the fields already entered. This is a fixed template that runs
 * in the browser; no AI model is involved, and the UI says so.
 */
function buildTemplate(d: EncounterDraft): ScribeDraft {
  const cc = d.soap.chiefComplaint.trim()
  const recorded = VITAL_SPECS.filter((s) => d.vitals[s.key].trim() !== "")
  const flagged = VITAL_SPECS.filter((s) => vitalFlag(s, d.vitals[s.key]))
  const vitalsLine = recorded.length
    ? recorded.map((s) => `${s.label} ${d.vitals[s.key]} ${s.unit}`).join(", ") + "."
    : "Vitals not yet recorded."
  const dx = d.soap.diagnosisCode.trim()
    ? `${d.soap.diagnosisCode.trim()} ${d.soap.diagnosisName.trim()}`.trim()
    : "Diagnosis to be confirmed."
  const meds = d.rx.filter((r) => r.medicineName.trim())
  return {
    subjective: cc ? `Presents with ${cc.charAt(0).toLowerCase()}${cc.slice(1)}.` : "Presenting complaint: [add].",
    objective:
      vitalsLine +
      (flagged.length ? ` Outside normal range: ${flagged.map((s) => s.label).join(", ")}.` : ""),
    assessment: dx,
    plan: meds.length
      ? `Start/continue ${meds.map((m) => [m.medicineName, m.dosage, m.frequency].filter(Boolean).join(" ")).join("; ")}. Review at follow-up.`
      : "No medication changes. Review at follow-up.",
  }
}

interface ScribeDemoProps {
  draft: EncounterDraft
  onInsert: (sections: ScribeDraft) => void
}

/** "Scribe (demo)" button plus a clearly labelled preview the clinician must review and insert. */
export function ScribeDemo({ draft, onInsert }: ScribeDemoProps) {
  const [preview, setPreview] = useState<ScribeDraft | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // Move focus into the preview when it opens, and back to the button when it closes.
  useEffect(() => {
    if (preview) sectionRef.current?.focus()
    else if (wasOpen.current) buttonRef.current?.focus()
    wasOpen.current = preview !== null
  }, [preview])

  if (!preview) {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setPreview(buildTemplate(draft))}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-medium text-primary transition-colors duration-150 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FlaskConical className="size-3.5" aria-hidden="true" />
        Scribe draft (demo)
      </button>
    )
  }

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      aria-labelledby="scribe-demo-heading"
      className="w-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring border border-dashed border-dept-amber-fg/40 bg-dept-amber-bg/60 p-3 animate-in fade-in-0 duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 id="scribe-demo-heading" className="text-sm font-semibold text-dept-amber-fg">
            Demo draft — review before saving
          </h4>
          <p className="text-xs text-foreground/80">
            A fixed template filled from the fields above. No AI model was used; check every line.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPreview(null)}
          aria-label="Discard demo draft"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-dept-amber-fg hover:bg-dept-amber-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <dl className="mt-2 space-y-1.5 text-sm">
        {SOAP_SECTIONS.map((s) => (
          <div key={s.key} className="flex gap-2">
            <dt className="w-5 shrink-0 font-mono font-semibold text-dept-amber-fg">{s.letter}</dt>
            <dd className="text-foreground">{preview[s.key]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            onInsert(preview)
            setPreview(null)
          }}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Insert into note
        </button>
        <button
          type="button"
          onClick={() => setPreview(null)}
          className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Discard
        </button>
      </div>
    </section>
  )
}
