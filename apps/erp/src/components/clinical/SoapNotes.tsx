import { cn } from "@/lib/utils"
import { DiagnosisPicker, fieldClass } from "./DiagnosisPicker"
import { ScribeDemo } from "./ScribeDemo"
import {
  SOAP_SECTIONS,
  visibleError,
  type DraftIssues,
  type EncounterDraft,
  type SoapDraft,
  type SoapSectionKey,
} from "./encounter-model"

interface SoapNotesProps {
  draft: EncounterDraft
  errors: DraftIssues["soap"]
  showAllErrors: boolean
  onChange: (patch: Partial<SoapDraft>) => void
}

/** Chief complaint, four labelled SOAP sections, the ICD-10 picker and the demo scribe. */
export function SoapNotes({ draft, errors, showAllErrors, onChange }: SoapNotesProps) {
  const soap = draft.soap
  const ccError = visibleError(soap.chiefComplaint, errors.chiefComplaint, showAllErrors)
  const notesError = showAllErrors ? errors.notes : undefined

  const insertScribe = (sections: Record<SoapSectionKey, string>) => {
    const patch: Partial<SoapDraft> = {}
    for (const s of SOAP_SECTIONS) {
      const current = soap[s.key].trim()
      patch[s.key] = current ? `${current}\n${sections[s.key]}` : sections[s.key]
    }
    onChange(patch)
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="soap-cc" className="mb-1 block text-sm font-semibold text-foreground">
          Chief complaint
        </label>
        <input
          id="soap-cc"
          value={soap.chiefComplaint}
          onChange={(e) => onChange({ chiefComplaint: e.target.value })}
          placeholder="e.g. Chest tightness on exertion for 2 weeks"
          autoComplete="off"
          aria-invalid={ccError ? true : undefined}
          aria-describedby={ccError ? "soap-cc-error" : undefined}
          className={cn(fieldClass, "h-10", ccError ? "border-alert" : "border-input")}
        />
        {ccError && (
          <p id="soap-cc-error" className="mt-1 text-xs font-medium text-alert">
            {ccError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">SOAP note</h3>
            <p id="soap-notes-hint" className="text-xs text-muted-foreground">
              Fill the sections you need; they are saved together as the clinical note.
            </p>
          </div>
          <ScribeDemo draft={draft} onInsert={insertScribe} />
        </div>
        {notesError && (
          <p id="soap-notes-error" role="alert" className="text-xs font-medium text-alert">
            {notesError}
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SOAP_SECTIONS.map((s) => {
            const id = `soap-${s.key}`
            return (
              <div key={s.key}>
                <label htmlFor={id} className="mb-1 flex items-baseline gap-2 text-xs font-medium text-foreground">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-5 items-center justify-center rounded bg-primary/10 font-mono text-[11px] font-bold text-primary"
                  >
                    {s.letter}
                  </span>
                  {s.label}
                  <span className="font-normal text-muted-foreground">· {s.hint}</span>
                </label>
                <textarea
                  id={id}
                  rows={4}
                  value={soap[s.key]}
                  onChange={(e) => onChange({ [s.key]: e.target.value })}
                  aria-invalid={notesError ? true : undefined}
                  aria-describedby={notesError ? "soap-notes-error" : "soap-notes-hint"}
                  className={cn(fieldClass, "min-h-24 resize-y py-2 leading-relaxed", notesError ? "border-alert" : "border-input")}
                />
              </div>
            )
          })}
        </div>
      </div>

      <DiagnosisPicker
        code={soap.diagnosisCode}
        name={soap.diagnosisName}
        codeError={visibleError(soap.diagnosisCode, errors.diagnosisCode, showAllErrors)}
        nameError={visibleError(soap.diagnosisName, errors.diagnosisName, showAllErrors)}
        onChange={({ code, name }) =>
          onChange({ ...(code !== undefined && { diagnosisCode: code }), ...(name !== undefined && { diagnosisName: name }) })
        }
      />
    </div>
  )
}
