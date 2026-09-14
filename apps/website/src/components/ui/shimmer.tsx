import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function Shimmer({ className, children = "Generating response…", ...props }: ShimmerProps) {
  return (
    <p className={cn("shimmer text-sm text-slate-500 font-medium", className)} {...props}>
      {children}
    </p>
  );
}

export function ShimmerDemo() {
  return (
    <p className="shimmer text-sm text-slate-500 font-medium">
      Generating response&hellip;
    </p>
  );
}

export default ShimmerDemo;
