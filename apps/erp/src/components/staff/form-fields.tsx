import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { fieldClass, labelClass, selectClass } from "../audit/controls"

export type FieldErrors = Partial<Record<string, string>>

interface BaseProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
}

function Described({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-alert">
          {error}
        </p>
      )}
    </>
  )
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

function Label({ id, label, required }: BaseProps) {
  return (
    <label htmlFor={id} className={labelClass}>
      {label}
      {required && (
        <span className="text-alert" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  )
}

export function TextField(
  props: BaseProps & { value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string; mono?: boolean }
) {
  const { id, required, error, hint, value, onChange, type = "text", placeholder, autoComplete, mono } = props
  return (
    <div className="flex flex-col gap-1.5">
      <Label {...props} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(fieldClass, mono && "font-mono")}
      />
      <Described id={id} error={error} hint={hint} />
    </div>
  )
}

export function SelectField(props: BaseProps & { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const { id, required, error, hint, value, onChange, children } = props
  return (
    <div className="flex flex-col gap-1.5">
      <Label {...props} />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={selectClass}
      >
        {children}
      </select>
      <Described id={id} error={error} hint={hint} />
    </div>
  )
}

/** Numbered step list; the current step has aria-current="step". */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Onboarding steps">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150",
                done ? "bg-care text-white" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              {done && <span className="sr-only">Done:</span>}
            </span>
            <span className={cn("truncate text-xs", active ? "font-semibold text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-border" />}
          </li>
        )
      })}
    </ol>
  )
}
