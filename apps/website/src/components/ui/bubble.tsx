import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bubbleVariants = cva(
  "relative flex flex-col max-w-[85%] text-sm transition-all",
  {
    variants: {
      align: {
        start: "self-start items-start",
        end: "self-end items-end",
      },
      variant: {
        default: "[&>.bubble-box]:bg-[#1F5084] [&>.bubble-box]:text-white",
        muted: "[&>.bubble-box]:bg-slate-100 [&>.bubble-box]:text-slate-800 dark:[&>.bubble-box]:bg-slate-800 dark:[&>.bubble-box]:text-slate-100",
        brand: "[&>.bubble-box]:bg-blue-500 [&>.bubble-box]:text-white",
        clinical: "[&>.bubble-box]:bg-[#EAF2F9] [&>.bubble-box]:text-[#1F5084] [&>.bubble-box]:border [&>.bubble-box]:border-[#CBD5E1]",
      },
    },
    defaultVariants: {
      align: "start",
      variant: "default",
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {
  align?: "start" | "end";
  variant?: "default" | "muted" | "brand" | "clinical";
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, align = "start", variant = "default", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(bubbleVariants({ align, variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);
Bubble.displayName = "Bubble";

const BubbleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bubble-box px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs break-words",
      className
    )}
    {...props}
  />
));
BubbleContent.displayName = "BubbleContent";

const BubbleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 w-full", className)}
    {...props}
  />
));
BubbleGroup.displayName = "BubbleGroup";

const BubbleReactions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "-mt-2.5 z-10 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] shadow-xs dark:border-slate-800 dark:bg-slate-900 select-none",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
BubbleReactions.displayName = "BubbleReactions";

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions };
export default Bubble;
