import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { inputClass, selectClass } from "./controls"

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/** Label + control + hint + inline error. Control ids: `${id}-hint`, `${id}-error`. */
export function FieldShell({ id, label, required, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
        {required ? (
          <span className="text-alert" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-alert">{error}</p>
      )}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, hint, error, required, wrapperClassName, className, ...props }, ref) => (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={wrapperClassName}>
      <input
        ref={ref}
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputClass, className)}
        {...props}
      />
    </FieldShell>
  )
)
TextField.displayName = "TextField"

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string
  label: string
  hint?: string
  error?: string
  placeholder: string
  options: ReadonlyArray<{ value: string; label: string }>
  wrapperClassName?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, hint, error, required, placeholder, options, wrapperClassName, className, ...props }, ref) => (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(selectClass, className)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </FieldShell>
  )
)
SelectField.displayName = "SelectField"
