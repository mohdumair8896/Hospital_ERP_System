import type { Patient } from "@hospital/contracts"
import { HeartPulse, Pill, ShieldCheck, UserRound } from "lucide-react"

/** Read-only details for the patient in context: medications, emergency contact, cover. */
export function PatientSummary({ patient }: { patient: Patient }) {
  const meds = (patient.activeMedications ?? []).filter(Boolean)
  const allergies = (patient.allergies ?? []).filter(Boolean)
  const contact = patient.emergencyContact

  return (
    <section aria-labelledby="clinical-summary-heading" className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <h2 id="clinical-summary-heading" className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <HeartPulse className="size-4 text-primary" aria-hidden="true" />
        Patient summary
      </h2>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Allergies</dt>
          <dd className={allergies.length ? "font-medium text-alert" : "text-foreground"}>
            {allergies.length ? allergies.join(", ") : "No known allergies"}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Pill className="size-3.5" aria-hidden="true" /> Active medications
          </dt>
          <dd>
            {meds.length ? (
              <ul className="mt-1 space-y-0.5 text-foreground">
                {meds.map((m) => (
                  <li key={m} className="truncate" title={m}>
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">None recorded</span>
            )}
          </dd>
        </div>
        {contact?.name && (
          <div>
            <dt className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <UserRound className="size-3.5" aria-hidden="true" /> Emergency contact
            </dt>
            <dd className="text-foreground">
              {contact.name}
              {contact.relationship && <span className="text-muted-foreground"> ({contact.relationship})</span>}
              {contact.phone && <span className="block tabular-nums text-muted-foreground">{contact.phone}</span>}
            </dd>
          </div>
        )}
        {patient.insuranceProvider && (
          <div>
            <dt className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5" aria-hidden="true" /> Insurance
            </dt>
            <dd className="text-foreground">
              {patient.insuranceProvider}
              {patient.insurancePolicyNumber && (
                <span className="block font-mono text-xs text-muted-foreground">{patient.insurancePolicyNumber}</span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </section>
  )
}
