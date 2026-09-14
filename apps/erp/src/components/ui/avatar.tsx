import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-14 text-lg",
  "2xl": "size-16 text-xl",
};

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: keyof typeof sizeClasses;
  status?: "online" | "offline" | "busy" | "away";
  src?: string;
  alt?: string;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "md", status, src, alt, children, ...props }, ref) => {
  return (
    <div className="relative inline-flex shrink-0">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full ring-1 ring-border/50 bg-slate-100 dark:bg-slate-800 font-medium select-none",
          sizeClasses[size] || sizeClasses.md,
          className
        )}
        {...props}
      >
        {src && <AvatarImage src={src} alt={alt || ""} />}
        {alt && !children && <AvatarFallback>{alt.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>}
        {children}
      </AvatarPrimitive.Root>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900",
            size === "xs" ? "size-1.5" : size === "sm" ? "size-2" : size === "lg" ? "size-3.5" : "size-2.5",
            status === "online" && "bg-emerald-500",
            status === "offline" && "bg-slate-400",
            status === "busy" && "bg-rose-500",
            status === "away" && "bg-amber-400"
          )}
        />
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold dark:bg-slate-800 dark:text-slate-200",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const AvatarBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-500",
      className
    )}
    {...props}
  />
));
AvatarBadge.displayName = "AvatarBadge";

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center -space-x-2.5 overflow-hidden p-0.5", className)}
    {...props}
  >
    {children}
  </div>
));
AvatarGroup.displayName = "AvatarGroup";

const AvatarGroupCount = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-900 dark:bg-slate-800 dark:text-slate-300",
      className
    )}
    {...props}
  >
    {children}
  </span>
));
AvatarGroupCount.displayName = "AvatarGroupCount";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
