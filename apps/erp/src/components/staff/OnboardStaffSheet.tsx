import * as React from "react"
import type { UserRole, UserSession } from "@hospital/contracts"
import { ArrowLeft, ArrowRight, Eye, EyeOff, RefreshCw, UserPlus } from "lucide-react"
import { Sheet } from "@/components/primitives"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { buttonClass } from "../audit/controls"
import { DEPARTMENTS, STAFF_ROLES, departmentName, generateTemporaryPassword, roleLabel, suggestUsername } from "./staff-data"
import { StepIndicator, TextField, SelectField, type FieldErrors } from "./form-fields"

export interface OnboardForm {
  name: string
  email: string
  licenseNumber: string
  role: UserRole
  departmentId: string
  username: string
  usernameEdited: boolean
  tempPassword: string
}

const STEPS = ["Profile", "Role & access", "Review & create"]
const FIRST_FIELD = ["onboard-name", "onboard-role", "onboard-tempPassword"]

const emptyForm = (): OnboardForm => ({
  name: "",
  email: "",
  licenseNumber: "",
  role: "DOCTOR",
  departmentId: DEPARTMENTS[0]?.id ?? "",
  username: "",
  usernameEdited: false,
  tempPassword: generateTemporaryPassword(),
})

function validate(step: number, f: OnboardForm, taken: Set<string>): FieldErrors {
  const e: FieldErrors = {}
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = "Enter the staff member's full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid work email, for example name@hospital.com."
  }
  if (step === 1) {
    const u = f.username.trim()
    if (!/^[a-z0-9._-]{3,50}$/.test(u)) e.username = "Use 3 to 50 lowercase letters, digits, dots, dashes or underscores."
    else if (taken.has(u)) e.username = `The username "${u}" is already in use.`
    if ((f.role === "DOCTOR" || f.role === "NURSE") && !f.departmentId) e.departmentId = "Doctors and nurses need a department."
  }
  return e
}

interface OnboardStaffSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  takenUsernames: Set<string>
  onCreated: (user: UserSession, form: OnboardForm) => void
}

/** Three-step onboarding form in a side panel; POST /api/v1/auth/users only on the last step. */
export function OnboardStaffSheet({ open, onOpenChange, takenUsernames, onCreated }: OnboardStaffSheetProps) {
  const [step, setStep] = React.useState(0)
  const [form, setForm] = React.useState<OnboardForm>(emptyForm)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setStep(0)
    setForm(emptyForm())
    setErrors({})
    setSubmitError(null)
    setShowPassword(false)
  }, [open])

  const set = (patch: Partial<OnboardForm>) =>
    setForm((prev) => {
      const next = { ...prev, ...patch }
      if (!next.usernameEdited && ("name" in patch || "role" in patch)) next.username = next.name.trim() ? suggestUsername(next.name, next.role) : ""
      return next
    })

  // Focus moves after the next render: to the first invalid field, or the first field of a new step.
  const [focusTarget, setFocusTarget] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!focusTarget) return
    document.getElementById(focusTarget)?.focus()
    setFocusTarget(null)
  }, [focusTarget])

  const goNext = () => {
    const errs = validate(step, form, takenUsernames)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) return setFocusTarget(`onboard-${first}`)
    const nextStep = Math.min(step + 1, STEPS.length - 1)
    setStep(nextStep)
    setFocusTarget(FIRST_FIELD[nextStep])
  }

  const goBack = () => {
    const prevStep = Math.max(step - 1, 0)
    setErrors({})
    setStep(prevStep)
    setFocusTarget(FIRST_FIELD[prevStep])
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < STEPS.length - 1) return goNext()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const resp = await apiFetch("/api/v1/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.tempPassword,
          role: form.role,
          departmentId: form.departmentId || undefined,
          doctorId: form.role === "DOCTOR" ? `doc_${form.username.trim()}` : undefined,
        }),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        const details = Array.isArray(data?.details) ? data.details.map((d: any) => d.message).join("; ") : ""
        throw new Error(`${data?.error || `The auth service responded with HTTP ${resp.status}.`}${details ? ` ${details}` : ""}`)
      }
      onCreated((data?.user ?? data) as UserSession, form)
    } catch (err) {
      setSubmitError(err instanceof TypeError ? "Could not reach the API gateway. Nothing was created; try again." : (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const roleMeta = STAFF_ROLES.find((r) => r.role === form.role)
  const footer = (
    <>
      {step > 0 && (
        <button type="button" onClick={goBack} className={cn(buttonClass("ghost"), "mr-auto")}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>
      )}
      <button type="button" onClick={() => onOpenChange(false)} className={buttonClass("secondary")}>
        Cancel
      </button>
      <button type="submit" form="onboard-form" disabled={submitting} className={buttonClass("primary")}>
        {step < STEPS.length - 1 ? (
          <>
            Next <ArrowRight className="size-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <UserPlus className="size-4" aria-hidden="true" />
            {submitting ? "Creating account…" : "Create account"}
          </>
        )}
      </button>
    </>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Onboard staff member" description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} footer={footer}>
      <StepIndicator steps={STEPS} current={step} />
      <form id="onboard-form" onSubmit={submit} noValidate className="mt-5">
        <div className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <TextField id="onboard-name" label="Full name" required value={form.name} onChange={(v) => set({ name: v })} error={errors.name} autoComplete="off" placeholder="Dr. Maya Fernandes" />
              <TextField id="onboard-email" label="Work email" required type="email" value={form.email} onChange={(v) => set({ email: v })} error={errors.email} autoComplete="off" placeholder="maya.fernandes@hospital.com" />
              <TextField
                id="onboard-licenseNumber"
                label="Licence number"
                value={form.licenseNumber}
                onChange={(v) => set({ licenseNumber: v })}
                hint="Optional. Printed on the hand-off slip only; the auth service does not store it yet."
              />
            </>
          )}
          {step === 1 && (
            <>
              <SelectField id="onboard-role" label="Role" required value={form.role} onChange={(v) => set({ role: v as UserRole })}>
                {STAFF_ROLES.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.label}
                  </option>
                ))}
              </SelectField>
              <SelectField id="onboard-departmentId" label="Department" value={form.departmentId} onChange={(v) => set({ departmentId: v })} error={errors.departmentId}>
                <option value="">No department (administrative)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </SelectField>
              <TextField
                id="onboard-username"
                label="Username"
                required
                value={form.username}
                onChange={(v) => set({ username: v.toLowerCase(), usernameEdited: true })}
                error={errors.username}
                hint="Suggested from the name and role; you can change it."
                mono
              />
            </>
          )}
          {step === 2 && (
            <>
              <dl className="divide-y divide-border rounded-lg border border-border text-sm">
                {[
                  ["Name", form.name],
                  ["Email", form.email],
                  ["Role", roleLabel(form.role)],
                  ["Department", departmentName(form.departmentId) ?? "None"],
                  ["Username", form.username],
                  ...(form.licenseNumber ? [["Licence", form.licenseNumber]] : roleMeta?.licensed ? [["Licence", "Not entered"]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 px-3 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="break-words text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="onboard-tempPassword" className="text-xs font-medium text-foreground">
                  Temporary password
                </label>
                <div className="flex gap-2">
                  <input id="onboard-tempPassword" readOnly type={showPassword ? "text" : "password"} value={form.tempPassword} aria-describedby="onboard-tempPassword-hint" className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-muted px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-pressed={showPassword} aria-label={showPassword ? "Hide password" : "Show password"} className={buttonClass("secondary", "md", "px-2.5")}>
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                  <button type="button" onClick={() => set({ tempPassword: generateTemporaryPassword() })} className={buttonClass("secondary", "md", "px-2.5")} aria-label="Generate a new password">
                    <RefreshCw className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="onboard-tempPassword-hint" className="text-xs text-muted-foreground">
                  Shown once on the hand-off slip. The staff member changes it at first sign-in.
                </p>
              </div>
              {submitError && (
                <p role="alert" className="rounded-lg border border-alert/25 bg-alert-soft px-3 py-2 text-sm text-alert">
                  <span className="font-semibold">Account not created.</span> {submitError}
                </p>
              )}
            </>
          )}
        </div>
      </form>
    </Sheet>
  )
}
