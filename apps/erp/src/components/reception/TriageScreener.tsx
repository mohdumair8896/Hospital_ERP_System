import { toast } from "sonner"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const triageQuestions = [
  { name: "acuity", required: true },
  { name: "symptoms", required: true },
  { name: "allergies" },
] as const

/** Intake triage questionnaire (content unchanged; moved out of ReceptionDesk). */
export function TriageScreener({ onDone }: { onDone: () => void }) {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold text-foreground">Emergency &amp; Intake Triage Questionnaire</h2>
        <p className="text-xs text-muted-foreground">
          Acuity levels follow the Emergency Severity Index (ESI). Demo form: answers are not scored, saved or sent to the Clinical Workbench.
        </p>
      </div>

      <Questionnaire
        items={triageQuestions}
        defaultItem="acuity"
        onSubmit={(e) => {
          e.preventDefault()
          toast.info("Triage questionnaire completed", {
            description: "Demo only: nothing was saved or sent. Record acuity and vitals in the Clinical Workbench.",
          })
          onDone()
        }}
      >
        <QuestionnaireProgress />

        <QuestionnaireItem name="acuity" required>
          <QuestionnaireTitle>What is the patient's primary acuity status?</QuestionnaireTitle>
          <QuestionnaireDescription>Select the most accurate clinical urgency level upon presentation.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="resuscitation">Level 1 - Immediate Resuscitation / Unstable Vitals</QuestionnaireChoice>
            <QuestionnaireChoice value="emergent">Level 2 - Emergent / High Risk Chest Pain or Stroke</QuestionnaireChoice>
            <QuestionnaireChoice value="urgent">Level 3 - Urgent / Requires multiple resources</QuestionnaireChoice>
            <QuestionnaireChoice value="routine">Level 4/5 - Semi-urgent or Routine Outpatient Follow-up</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="symptoms" required>
          <QuestionnaireTitle>Chief Presenting Symptoms</QuestionnaireTitle>
          <QuestionnaireDescription>Primary reason for the emergency or outpatient consultation.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="cardiac">Cardiovascular / Palpitations / Hypertension</QuestionnaireChoice>
            <QuestionnaireChoice value="respiratory">Dyspnea / Cough / Wheezing</QuestionnaireChoice>
            <QuestionnaireChoice value="neurological">Severe Headache / Syncope / Dizziness</QuestionnaireChoice>
            <QuestionnaireChoice value="general">Fever / Abdominal Pain / Generalized Malaise</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="allergies">
          <QuestionnaireTitle>Known Severe Drug Allergies?</QuestionnaireTitle>
          <QuestionnaireDescription>Record any severe anaphylactic reactions to penicillins or NSAIDs.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="none">NKDA (No Known Drug Allergies)</QuestionnaireChoice>
            <QuestionnaireChoice value="penicillin">Penicillin / Beta-lactams</QuestionnaireChoice>
            <QuestionnaireChoice value="nsaids">Aspirin / NSAIDs</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext>Next Question</QuestionnaireNext>
          <QuestionnaireSubmit>Submit Assessment</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
