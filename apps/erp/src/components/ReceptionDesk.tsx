import React, { useState, useEffect } from "react"
import {
  ClipboardList,
  UserPlus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Play,
  CheckCheck,
  XCircle,
  RefreshCw,
  Search,
  Activity,
  HeartPulse,
  User,
  ShieldCheck,
  Stethoscope,
} from "lucide-react"
import { Appointment, Patient, AppointmentStatus } from "@hospital/contracts"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/api"

// UI Component Integrations
import { DataTable } from "@/components/ui/data-table"
import { TableDemo } from "@/components/ui/table-demo"
import { Table01DividerLine } from "@/components/application/table/table-01-divider-line"
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group"
import { Badge } from "@/components/ui/badge"
import { BadgeGroup } from "@/components/base/badges/badge-groups"
import { Button } from "@/components/base/buttons/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Separator } from "@/components/ui/separator"

const triageQuestions = [
  { name: "acuity", required: true },
  { name: "symptoms", required: true },
  { name: "allergies" },
] as const

export default function ReceptionDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"APPOINTMENTS" | "NEW_PATIENT" | "TRIAGE_SCREENER" | "BILLING_INVOICES" | "STAFF_ROSTER">("APPOINTMENTS")

  // Selected date in Calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // New Patient Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("1990-01-01")
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE")
  const [bloodGroup, setBloodGroup] = useState<"A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-">("O+")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("New York")
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/appointments`)
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      console.error("Failed to load appointments:", err)
      toast.error("Failed to fetch appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success(`Appointment marked as ${status}`)
        fetchAppointments()
      }
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        bloodGroup,
        phoneNumber: phone,
        email,
        street,
        city,
        state: "NY",
        postalCode: "10001",
        emergencyContactName: "Guardian Contact",
        emergencyContactPhone: phone,
        emergencyContactRelation: "Family",
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to register patient")
      const saved = await res.json()
      setCreatedPatient(saved)
      toast.success(`Patient registered successfully! MRN: ${saved.mrn}`)
      setFirstName("")
      setLastName("")
      setPhone("")
      setEmail("")
      setStreet("")
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  // Appointment Queue Columns Configuration
  const appointmentColumns = [
    {
      accessorKey: "appointmentNumber",
      header: "Ref No.",
      cell: ({ row }: any) => (
        <span className="font-mono text-xs font-bold text-primary">
          {row.getValue("appointmentNumber")}
        </span>
      ),
    },
    {
      accessorKey: "patientName",
      header: "Patient Details",
      cell: ({ row }: any) => {
        const appt = row.original
        const patientName = appt.patientName || "Patient"
        const isFemale =
          patientName.includes("Elena") ||
          patientName.includes("Sarah") ||
          patientName.includes("Clara") ||
          patientName.includes("Emily") ||
          patientName.includes("Maya")
        const avatar = isFemale
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        return (
          <AvatarLabelGroup
            size="sm"
            src={avatar}
            alt={appt.patientName}
            title={appt.patientName}
            subtitle={appt.patientPhone || "No contact"}
          />
        )
      },
    },
    {
      accessorKey: "doctorName",
      header: "Doctor / Department",
      cell: ({ row }: any) => {
        const appt = row.original
        return (
          <div>
            <div className="font-semibold text-xs text-foreground">{appt.doctorName}</div>
            <div className="text-[11px] text-muted-foreground">{appt.departmentName}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "slotDate",
      header: "Date & Time",
      cell: ({ row }: any) => {
        const appt = row.original
        return (
          <div>
            <span className="font-medium text-xs text-foreground">{appt.slotDate}</span>
            <div className="text-[11px] text-primary font-semibold">{appt.slotTime}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as string
        if (status === "CONFIRMED") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              CONFIRMED
            </span>
          )
        }
        if (status === "IN_PROGRESS") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              IN CONSULT
            </span>
          )
        }
        if (status === "COMPLETED") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              COMPLETED
            </span>
          )
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Check-in Actions",
      cell: ({ row }: any) => {
        const appt = row.original
        return (
          <div className="flex items-center gap-1.5">
            {appt.status === "CONFIRMED" && (
              <Button
                color="secondary"
                size="sm"
                className="h-7 text-[11px] px-2"
                onClick={() => handleUpdateStatus(appt.id, "IN_PROGRESS")}
              >
                <Play className="w-3 h-3 mr-1" />
                Check-In
              </Button>
            )}
            {appt.status === "IN_PROGRESS" && (
              <Button
                color="primary"
                size="sm"
                className="h-7 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Complete
              </Button>
            )}
            {appt.status === "COMPLETED" && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Seen
              </span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header Tabs & Actions */}
      <div className="flex flex-wrap justify-between items-center bg-card border p-2.5 rounded-2xl shadow-xs gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("APPOINTMENTS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "APPOINTMENTS"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Appointments Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("NEW_PATIENT")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NEW_PATIENT"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Fast Patient Registration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TRIAGE_SCREENER")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "TRIAGE_SCREENER"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Clinical Triage Questionnaire</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BILLING_INVOICES")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "BILLING_INVOICES"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Billing &amp; Invoices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("STAFF_ROSTER")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "STAFF_ROSTER"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Staff Roster</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="secondary"
            size="sm"
            onClick={fetchAppointments}
            className="text-xs h-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* Tab 1: Appointments Queue */}
      {activeTab === "APPOINTMENTS" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Scheduled Outpatient Appointments ({appointments.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time OPD patient arrival tracking, clinic room assignments, and consultation queue.
              </p>
            </div>
            <BadgeGroup
              addonText="OPD Desk"
              color="success"
              theme="light"
              align="trailing"
              size="sm"
            >
              Clinic Check-In Active
            </BadgeGroup>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <DataTable
              columns={appointmentColumns}
              data={appointments}
              searchPlaceholder="Filter by patient name or ref..."
              searchColumn="patientName"
            />
          </div>
        </div>
      )}

      {/* Tab 2: New Patient Registration Form */}
      {activeTab === "NEW_PATIENT" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b pb-4 mb-6">
              <UserPlus className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Direct Patient Registration &amp; MRN Generation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Registers patient into hospital medical directory with full audit compliance.
                </p>
              </div>
            </div>

            {createdPatient && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">Patient Registered Successfully!</span>
                  <span>
                    MRN Assigned: <strong className="font-mono text-primary">{createdPatient.mrn}</strong> (
                    {createdPatient.firstName} {createdPatient.lastName})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatedPatient(null)}
                  className="text-emerald-700 underline font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <form onSubmit={handleRegisterPatient} className="space-y-5 text-xs">
              <FieldSet>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Field>
                    <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <NativeSelect
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                    >
                      <NativeSelectOption value="MALE">Male</NativeSelectOption>
                      <NativeSelectOption value="FEMALE">Female</NativeSelectOption>
                      <NativeSelectOption value="OTHER">Other</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bloodGroup">Blood Group</FieldLabel>
                    <NativeSelect
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as any)}
                    >
                      <NativeSelectOption value="A+">A+</NativeSelectOption>
                      <NativeSelectOption value="A-">A-</NativeSelectOption>
                      <NativeSelectOption value="B+">B+</NativeSelectOption>
                      <NativeSelectOption value="B-">B-</NativeSelectOption>
                      <NativeSelectOption value="AB+">AB+</NativeSelectOption>
                      <NativeSelectOption value="AB-">AB-</NativeSelectOption>
                      <NativeSelectOption value="O+">O+</NativeSelectOption>
                      <NativeSelectOption value="O-">O-</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Field>
                    <FieldLabel htmlFor="street">Residential Address</FieldLabel>
                    <input
                      id="street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Hospital Way"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </Field>
                </div>
              </FieldSet>

              <div className="pt-4 border-t flex justify-end">
                <Button color="primary" size="md" type="submit">
                  Generate MRN &amp; Register Patient
                </Button>
              </div>
            </form>
          </div>

          {/* Calendar Side Picker */}
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Slot Calendar Picker
            </h3>
            <p className="text-xs text-muted-foreground">
              Select date to filter or book upcoming clinic consultation slots.
            </p>
            <div className="flex justify-center border rounded-xl p-2 bg-muted/20">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Triage Screener Questionnaire */}
      {activeTab === "TRIAGE_SCREENER" && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Emergency &amp; Intake Triage Questionnaire
            </h2>
            <p className="text-xs text-muted-foreground">
              Automated scoring based on Emergency Severity Index (ESI) protocol.
            </p>
          </div>

          <Questionnaire
            items={triageQuestions}
            defaultItem="acuity"
            onSubmit={(e) => {
              e.preventDefault()
              toast.success("Triage Assessment Completed! Transmitted to Clinical Workbench.")
              setActiveTab("APPOINTMENTS")
            }}
          >
            <QuestionnaireProgress />

            <QuestionnaireItem name="acuity" required>
              <QuestionnaireTitle>What is the patient's primary acuity status?</QuestionnaireTitle>
              <QuestionnaireDescription>
                Select the most accurate clinical urgency level upon presentation.
              </QuestionnaireDescription>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="resuscitation">
                  Level 1 - Immediate Resuscitation / Unstable Vitals
                </QuestionnaireChoice>
                <QuestionnaireChoice value="emergent">
                  Level 2 - Emergent / High Risk Chest Pain or Stroke
                </QuestionnaireChoice>
                <QuestionnaireChoice value="urgent">
                  Level 3 - Urgent / Requires multiple resources
                </QuestionnaireChoice>
                <QuestionnaireChoice value="routine">
                  Level 4/5 - Semi-urgent or Routine Outpatient Follow-up
                </QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>

            <QuestionnaireItem name="symptoms" required>
              <QuestionnaireTitle>Chief Presenting Symptoms</QuestionnaireTitle>
              <QuestionnaireDescription>
                Primary reason for the emergency or outpatient consultation.
              </QuestionnaireDescription>
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
              <QuestionnaireDescription>
                Record any severe anaphylactic reactions to penicillins or NSAIDs.
              </QuestionnaireDescription>
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
      )}

      {/* Tab 4: Billing & Invoices (TableDemo) */}
      {activeTab === "BILLING_INVOICES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Patient Billing Accounts &amp; Insurance Clearance
              </h2>
              <p className="text-xs text-slate-500">
                Active settlement records, outstanding copays, and claims processing ledger.
              </p>
            </div>
            <Badge color="brand">Accounting Connected</Badge>
          </div>
          <TableDemo />
        </div>
      )}

      {/* Tab 5: Staff Roster (Table01DividerLine) */}
      {activeTab === "STAFF_ROSTER" && (
        <div className="space-y-4">
          <Table01DividerLine />
        </div>
      )}
    </div>
  )
}
