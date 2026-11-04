import { cn } from "@/lib/utils"
import { COMMON_ICD10_DIAGNOSES } from "./encounter-model"

interface DiagnosisPickerProps {
  code: string
  name: string
  codeError?: string
  nameError?: string
  onChange: (next: { code?: string; name?: string }) => void
}

export const fieldClass =
  "w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-shadow duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

/** Primary ICD-10 diagnosis: quick-pick of common codes plus free-text code and name. */
export function DiagnosisPicker({ code, name, codeError, nameError, onChange }: DiagnosisPickerProps) {
  const preset = COMMON_ICD10_DIAGNOSES.some((d) => d.code === code) ? code : ""

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3 sm:p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">Primary diagnosis (ICD-10)</legend>
      <div>
        <label htmlFor="dx-preset" className="mb-1 block text-xs font-medium text-foreground">
          Common diagnoses
        </label>
        <select
          id="dx-preset"
          value={preset}
          onChange={(e) => {
            const picked = COMMON_ICD10_DIAGNOSES.find((d) => d.code === e.target.value)
            if (picked) onChange({ code: picked.code, name: picked.name })
          }}
          className={cn(fieldClass, "h-9 cursor-pointer border-input")}
        >
          <option value="" disabled>
            Choose a common diagnosis…
          </option>
          {COMMON_ICD10_DIAGNOSES.map((d) => (
            <option key={d.code} value={d.code}>
              {d.code} — {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[8rem_1fr]">
        <div>
          <label htmlFor="dx-code" className="mb-1 block text-xs font-medium text-foreground">
            ICD-10 code
          </label>
          <input
            id="dx-code"
            value={code}
            onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
            placeholder="I10"
            autoComplete="off"
            aria-invalid={codeError ? true : undefined}
            aria-describedby={codeError ? "dx-code-error" : undefined}
            className={cn(fieldClass, "h-9 font-mono", codeError ? "border-alert" : "border-input")}
          />
          {codeError && (
            <p id="dx-code-error" className="mt-1 text-xs font-medium text-alert">
              {codeError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="dx-name" className="mb-1 block text-xs font-medium text-foreground">
            Diagnosis
          </label>
          <input
            id="dx-name"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Essential (primary) hypertension"
            autoComplete="off"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "dx-name-error" : undefined}
            className={cn(fieldClass, "h-9", nameError ? "border-alert" : "border-input")}
          />
          {nameError && (
            <p id="dx-name-error" className="mt-1 text-xs font-medium text-alert">
              {nameError}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  )
}
