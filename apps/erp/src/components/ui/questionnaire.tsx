"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "cn"

export type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped"

export interface QuestionnaireItemDef {
  name: string
  required?: boolean
}

interface QuestionnaireContextValue {
  items: readonly QuestionnaireItemDef[]
  currentIndex: number
  currentItem: QuestionnaireItemDef | undefined
  setCurrentIndex: (index: number) => void
  goToNext: () => void
  goToPrevious: () => void
  skipCurrent: () => void
  answers: Record<string, string>
  setAnswer: (name: string, value: string) => void
  errors: Record<string, string>
  setError: (name: string, error: string) => void
  isFirst: boolean
  isLast: boolean
  statusMap: Record<string, QuestionnaireItemStatus>
  setStatus: (name: string, status: QuestionnaireItemStatus) => void
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null)

export function useQuestionnaire() {
  const context = React.useContext(QuestionnaireContext)
  if (!context) {
    throw new Error("useQuestionnaire must be used within a Questionnaire")
  }
  return context
}

export interface QuestionnaireProps extends React.HTMLAttributes<HTMLFormElement> {
  items: readonly QuestionnaireItemDef[]
  defaultItem?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Questionnaire({
  items,
  defaultItem,
  onSubmit,
  children,
  className,
  ...props
}: QuestionnaireProps) {
  const initialIndex = defaultItem
    ? Math.max(0, items.findIndex((item) => item.name === defaultItem))
    : 0

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [statusMap, setStatusMap] = React.useState<Record<string, QuestionnaireItemStatus>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const currentItem = items[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === items.length - 1

  const setAnswer = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }))
    setStatusMap((prev) => ({ ...prev, [name]: "answered" }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const setStatus = (name: string, status: QuestionnaireItemStatus) => {
    setStatusMap((prev) => ({ ...prev, [name]: status }))
  }

  const setError = (name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const goToNext = () => {
    if (currentItem?.required && !answers[currentItem.name]) {
      setError(currentItem.name, "This field is required.")
      return
    }
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }

  const skipCurrent = () => {
    if (currentItem) {
      setStatus(currentItem.name, "skipped")
    }
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        items,
        currentIndex,
        currentItem,
        setCurrentIndex,
        goToNext,
        goToPrevious,
        skipCurrent,
        answers,
        setAnswer,
        errors,
        setError,
        isFirst,
        isLast,
        statusMap,
        setStatus,
      }}
    >
      <form
        onSubmit={onSubmit}
        className={cn("flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm", className)}
        {...props}
      >
        {children}
      </form>
    </QuestionnaireContext.Provider>
  )
}

export function QuestionnaireProgress({ className }: { className?: string }) {
  const { items, currentIndex } = useQuestionnaire()
  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100)

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between text-xs text-muted-foreground font-medium">
        <span>Step {currentIndex + 1} of {items.length}</span>
        <span>{progressPercent}% completed</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

const ItemContext = React.createContext<{ name: string; required?: boolean } | null>(null)

export interface QuestionnaireItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  required?: boolean
  onStatusChange?: (status: QuestionnaireItemStatus) => void
}

export function QuestionnaireItem({
  name,
  required,
  onStatusChange,
  children,
  className,
  ...props
}: QuestionnaireItemProps) {
  const { currentItem, statusMap } = useQuestionnaire()
  const isCurrent = currentItem?.name === name

  React.useEffect(() => {
    if (onStatusChange && statusMap[name]) {
      onStatusChange(statusMap[name])
    }
  }, [name, statusMap, onStatusChange])

  if (!isCurrent) {
    return null
  }

  return (
    <ItemContext.Provider value={{ name, required }}>
      <div className={cn("flex flex-col gap-4 animate-in fade-in-50 duration-200", className)} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  )
}

export function QuestionnaireTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-foreground", className)} {...props}>
      {children}
    </h3>
  )
}

export function QuestionnaireDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function QuestionnaireChoices({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-2.5 pt-1", className)} {...props}>
      {children}
    </div>
  )
}

export interface QuestionnaireChoiceProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function QuestionnaireChoice({
  value,
  children,
  className,
  ...props
}: QuestionnaireChoiceProps) {
  const itemContext = React.useContext(ItemContext)
  const { answers, setAnswer } = useQuestionnaire()

  const isSelected = itemContext ? answers[itemContext.name] === value : false

  return (
    <button
      type="button"
      onClick={() => itemContext && setAnswer(itemContext.name, value)}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border p-3.5 text-left text-sm font-medium transition-all",
        isSelected
          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
          : "border-input bg-background hover:bg-muted/60 text-foreground",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
    </button>
  )
}

export function QuestionnaireInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const itemContext = React.useContext(ItemContext)
  const { answers, setAnswer } = useQuestionnaire()
  const value = itemContext ? answers[itemContext.name] || "" : ""

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => itemContext && setAnswer(itemContext.name, e.target.value)}
      name={itemContext?.name}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export function QuestionnaireError({ className }: { className?: string }) {
  const itemContext = React.useContext(ItemContext)
  const { errors } = useQuestionnaire()
  const error = itemContext ? errors[itemContext.name] : null

  if (!error) return null

  return (
    <p className={cn("text-xs font-medium text-destructive", className)}>
      {error}
    </p>
  )
}

export function QuestionnaireActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 pt-4 border-t", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function QuestionnairePrevious({
  children = "Back",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { goToPrevious, isFirst } = useQuestionnaire()
  return (
    <button
      type="button"
      onClick={goToPrevious}
      disabled={isFirst}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {children}
    </button>
  )
}

export function QuestionnaireSkip({
  children = "Skip",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { skipCurrent, isLast } = useQuestionnaire()
  if (isLast) return null

  return (
    <button
      type="button"
      onClick={skipCurrent}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function QuestionnaireNext({
  children = "Next",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { goToNext, isLast } = useQuestionnaire()
  if (isLast) return null

  return (
    <button
      type="button"
      onClick={goToNext}
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}

export function QuestionnaireSubmit({
  children = "Submit",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isLast } = useQuestionnaire()
  if (!isLast) return null

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
