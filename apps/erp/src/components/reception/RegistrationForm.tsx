import { useEffect, useId, type KeyboardEvent, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserPlus } from "lucide-react"
import { buttonClass, kbdClass } from "./controls"
import { SelectField, TextField } from "./FormField"
import {
  BLOOD_GROUPS,
  GENDERS,
  REGISTRATION_DEFAULTS,
  registrationSchema,
  type RegistrationInput,
  type RegistrationValues,
} from "./registration-schema"

const GENDER_OPTIONS = GENDERS.map((g) => ({ value: g, label: g === "UNDISCLOSED" ? "Prefer not to say" : g.charAt(0) + g.slice(1).toLowerCase() }))
const BLOOD_OPTIONS = BLOOD_GROUPS.map((b) => ({ value: b, label: b }))

interface RegistrationFormProps {
  onValidSubmit: (values: RegistrationValues) => void
  busy: boolean
  /** Disables submit while another step (the duplicate review) is pending. */
  locked?: boolean
  busyLabel?: string
  /** Increment to move focus to the first field (e.g. when opened from `?action=register`). */
  focusSignal: number
  /** Increment to clear the form after a successful registration. */
  resetSignal: number
  /** Rendered just above the actions, e.g. the duplicate review. */
  review?: ReactNode
  /** Called when any field changes, so a stale duplicate review can be dismissed. */
  onEdit?: () => void
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="grid grid-cols-1 gap-4 border-t border-border pt-4 first-of-type:border-0 first-of-type:pt-0 sm:grid-cols-2">
      <legend className="float-left mb-1 w-full text-eyebrow uppercase text-muted-foreground sm:col-span-2">{legend}</legend>
      {children}
    </fieldset>
  )
}

/** Labelled registration form (P-FORM-4): rhf + zod, inline errors, disabled until valid, Ctrl/Cmd+Enter. */
export function RegistrationForm({ onValidSubmit, busy, locked = false, busyLabel, focusSignal, resetSignal, review, onEdit }: RegistrationFormProps) {
  const id = useId()
  const f = (name: string) => `${id}-${name}`
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm<RegistrationInput, unknown, RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: REGISTRATION_DEFAULTS,
  })

  useEffect(() => {
    if (focusSignal > 0) setFocus("firstName")
  }, [focusSignal, setFocus])

  useEffect(() => {
    if (resetSignal > 0) reset(REGISTRATION_DEFAULTS)
  }, [resetSignal, reset])

  useEffect(() => {
    if (!onEdit) return
    const sub = watch(() => onEdit())
    return () => sub.unsubscribe()
  }, [watch, onEdit])

  const submit = handleSubmit(onValidSubmit)
  const canSubmit = isValid && !busy && !locked

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (canSubmit) submit()
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form noValidate onSubmit={submit} onKeyDown={onKeyDown} aria-labelledby={f("title")} className="flex flex-col gap-5">
      <h3 id={f("title")} className="sr-only">New patient registration</h3>
      <Group legend="Identity">
        <TextField id={f("first")} label="First name" required autoComplete="off" error={errors.firstName?.message} {...register("firstName")} />
        <TextField id={f("last")} label="Last name" required autoComplete="off" error={errors.lastName?.message} {...register("lastName")} />
        <TextField id={f("dob")} label="Date of birth" type="date" max={today} required error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
        <div className="grid grid-cols-2 gap-4">
          <SelectField id={f("gender")} label="Sex" required placeholder="Select…" options={GENDER_OPTIONS} error={errors.gender?.message} {...register("gender")} />
          <SelectField id={f("blood")} label="Blood group" required placeholder="Select…" options={BLOOD_OPTIONS} error={errors.bloodGroup?.message} {...register("bloodGroup")} />
        </div>
      </Group>

      <Group legend="Contact">
        <TextField id={f("phone")} label="Phone" type="tel" required autoComplete="off" hint="Used for the duplicate check and SMS reminders" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
        <TextField id={f("email")} label="Email" type="email" required autoComplete="off" error={errors.email?.message} {...register("email")} />
        <TextField id={f("street")} label="Street address" required autoComplete="off" wrapperClassName="sm:col-span-2" error={errors.street?.message} {...register("street")} />
        <TextField id={f("city")} label="City" required autoComplete="off" error={errors.city?.message} {...register("city")} />
        <div className="grid grid-cols-2 gap-4">
          <TextField id={f("state")} label="State" required autoComplete="off" error={errors.state?.message} {...register("state")} />
          <TextField id={f("postal")} label="Postal code" required autoComplete="off" error={errors.postalCode?.message} {...register("postalCode")} />
        </div>
      </Group>

      <Group legend="Emergency contact">
        <TextField id={f("ecName")} label="Name" required autoComplete="off" error={errors.emergencyContactName?.message} {...register("emergencyContactName")} />
        <TextField id={f("ecRel")} label="Relationship" required autoComplete="off" hint="e.g. Spouse, Parent" error={errors.emergencyContactRelation?.message} {...register("emergencyContactRelation")} />
        <TextField id={f("ecPhone")} label="Phone" type="tel" required autoComplete="off" error={errors.emergencyContactPhone?.message} {...register("emergencyContactPhone")} />
      </Group>

      <Group legend="Clinical and insurance">
        <TextField id={f("allergies")} label="Known allergies" autoComplete="off" hint="Separate with commas, e.g. Penicillin, Latex" wrapperClassName="sm:col-span-2" {...register("allergies")} />
        <TextField id={f("insurer")} label="Insurance provider" autoComplete="off" {...register("insuranceProvider")} />
        <TextField id={f("policy")} label="Policy number" autoComplete="off" {...register("insurancePolicyNumber")} />
      </Group>

      {review}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={f("submit-hint")} className="text-xs text-muted-foreground">
          {locked ? (
            "Review the possible duplicates above first."
          ) : isValid ? (
            <>
              Ready. Press <kbd className={kbdClass}>Ctrl</kbd> + <kbd className={kbdClass}>Enter</kbd> to register.
            </>
          ) : (
            "Complete the required fields (*) to enable registration."
          )}
        </p>
        <button type="submit" disabled={!canSubmit} aria-describedby={f("submit-hint")} className={buttonClass("primary", "md", "w-full sm:w-auto")}>
          {busy ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
          {busy ? busyLabel ?? "Working…" : "Check duplicates & register"}
        </button>
      </div>
    </form>
  )
}
