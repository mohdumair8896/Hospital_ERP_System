import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Rendered as the dialog title (required for screen readers). */
  title: React.ReactNode
  description?: React.ReactNode
  /** `md` = 480px, `lg` = 640px. Always full width below 640px. */
  width?: "md" | "lg"
  /** Sticky footer, typically the primary/secondary actions. */
  footer?: React.ReactNode
  /** Extra classes for the scrollable body. */
  bodyClassName?: string
  className?: string
  children: React.ReactNode
}

/**
 * Right-side panel built on Radix Dialog: focus trap, Escape to close, focus returns to the
 * element that opened it. Slides in over 250ms (disabled under reduced motion).
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  width = "md",
  footer,
  bodyClassName,
  className,
  children,
}: SheetProps) {
  // Controlled sheets have no Radix Trigger, so remember the opener and restore focus to it.
  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  React.useLayoutEffect(() => {
    if (!open) return
    const active = document.activeElement
    returnFocusRef.current = active instanceof HTMLElement && active !== document.body ? active : null
  }, [open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-250"
        />
        <DialogPrimitive.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          onCloseAutoFocus={(event) => {
            const opener = returnFocusRef.current
            if (opener?.isConnected) {
              event.preventDefault()
              opener.focus()
            }
          }}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border bg-card text-card-foreground shadow-lift outline-none",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right duration-250 ease-out-soft",
            width === "lg" ? "sm:max-w-[640px]" : "sm:max-w-[480px]",
            className
          )}
        >
          <header className="flex items-start gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <DialogPrimitive.Title className="text-base font-semibold leading-tight text-foreground">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label="Close panel"
              className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </header>
          <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", bodyClassName)}>{children}</div>
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-5 py-3">
              {footer}
            </footer>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
