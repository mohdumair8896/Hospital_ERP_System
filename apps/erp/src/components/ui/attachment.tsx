import * as React from "react";
import { cn } from "@/lib/utils";

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  state?: "idle" | "uploading" | "error" | "success";
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  ({ className, orientation = "horizontal", state = "idle", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "group relative flex rounded-xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900",
          orientation === "vertical" ? "flex-col gap-3" : "flex-row items-center gap-3",
          state === "uploading" && "border-blue-300 bg-blue-50/30 dark:border-blue-800",
          state === "error" && "border-rose-300 bg-rose-50/30 dark:border-rose-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Attachment.displayName = "Attachment";

const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full", className)}
    {...props}
  />
));
AttachmentGroup.displayName = "AttachmentGroup";

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "icon" | "image";
}

const AttachmentMedia = React.forwardRef<HTMLDivElement, AttachmentMediaProps>(
  ({ className, variant = "icon", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        variant === "image"
          ? "aspect-video w-full object-cover [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
          : "size-10 [&>svg]:size-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
AttachmentMedia.displayName = "AttachmentMedia";

const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-hidden leading-snug", className)}
    {...props}
  />
));
AttachmentContent.displayName = "AttachmentContent";

const AttachmentTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("truncate text-xs font-semibold text-slate-900 dark:text-slate-100", className)}
    {...props}
  />
));
AttachmentTitle.displayName = "AttachmentTitle";

const AttachmentDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("truncate text-[11px] text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));
AttachmentDescription.displayName = "AttachmentDescription";

const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 items-center gap-1", className)}
    {...props}
  />
));
AttachmentActions.displayName = "AttachmentActions";

const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors [&>svg]:size-4",
      className
    )}
    {...props}
  />
));
AttachmentAction.displayName = "AttachmentAction";

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
};
export default Attachment;
