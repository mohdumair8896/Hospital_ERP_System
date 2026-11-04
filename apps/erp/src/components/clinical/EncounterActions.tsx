import { useRef, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { ENCOUNTER_TYPES, type EncounterType } from "./encounter-model"

export interface SaveSummary {
  patientName: string
  diagnosis: string
  vitals: string
  abnormal: string[]
  medications: string[]
}

interface EncounterActionsProps {
  type: EncounterType
  onTypeChange: (type: EncounterType) => void
  dirty: boolean
  saving: boolean
  onClear: () => void
  /** Validates the draft; return true to open the confirmation. */
  onRequestSave: () => boolean
  summary: SaveSummary
  onConfirm: () => void
  /** When set, signing is unavailable (e.g. the session has no physician identity) and this explains why. */
  signBlockedReason?: string
}

const outlineBtn =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-card"

/** Sticky footer: encounter type, discard draft, and sign & save with a confirm dialog. */
export function EncounterActions(props: EncounterActionsProps) {
  const { type, onTypeChange, dirty, saving, onClear, onRequestSave, summary, onConfirm, signBlockedReason } = props
  const [confirmOpen, setConfirmOpen] = useState(false)
  const saveRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="sticky bottom-0 z-[5] flex flex-col gap-3 rounded-b-xl border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div role="group" aria-label="Encounter type" className="inline-flex w-fit rounded-lg border border-border bg-muted p-0.5">
        {ENCOUNTER_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={type === t.value}
            onClick={() => onTypeChange(t.value)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              type === t.value ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AlertDialog>
          {/* aria-disabled (not disabled) so focus can return here after the draft is discarded. */}
          <AlertDialogTrigger
            className={outlineBtn}
            aria-disabled={!dirty || saving || undefined}
            onClick={(e) => {
              if (!dirty || saving) e.preventDefault()
            }}
          >
            Discard draft
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
              <AlertDialogDescription>
                Vitals, notes, diagnosis and prescriptions entered for {summary.patientName} will be cleared. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onClear}>
                Discard draft
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {signBlockedReason && (
          <p id="sign-blocked-reason" className="text-xs text-muted-foreground">
            {signBlockedReason}
          </p>
        )}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <button
            ref={saveRef}
            type="button"
            aria-disabled={saving || Boolean(signBlockedReason) || undefined}
            aria-describedby={signBlockedReason ? "sign-blocked-reason" : undefined}
            onClick={() => {
              if (!saving && !signBlockedReason && onRequestSave()) setConfirmOpen(true)
            }}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            )}
            {saving ? "Saving…" : "Sign & save encounter"}
          </button>
          <AlertDialogContent
            onCloseAutoFocus={(event) => {
              // No Radix Trigger here, so return focus to the save button explicitly.
              event.preventDefault()
              saveRef.current?.focus()
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Sign and save this encounter?</AlertDialogTitle>
              <AlertDialogDescription>
                It will be added to {summary.patientName}'s record as a finalized {type} encounter under your name.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <dl className="grid gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Diagnosis</dt>
                <dd className="text-foreground">{summary.diagnosis}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Vitals</dt>
                <dd className="text-foreground">
                  {summary.vitals}
                  {summary.abnormal.length > 0 && (
                    <span className="block text-xs font-medium text-dept-amber-fg">
                      Outside normal range: {summary.abnormal.join(", ")}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Medications</dt>
                <dd className="text-foreground">{summary.medications.length ? summary.medications.join(", ") : "None"}</dd>
              </div>
            </dl>
            <AlertDialogFooter>
              <AlertDialogCancel>Review again</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>Sign &amp; save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
