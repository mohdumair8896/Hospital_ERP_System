"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full flex-col rounded-md border border-slate-200 bg-white transition-[color,box-shadow]",
        "focus-within:border-[#1F5084] focus-within:ring-1 focus-within:ring-[#1F5084]",
        "has-[[data-slot][aria-invalid=true]]:border-red-500 has-[[data-slot][aria-invalid=true]]:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-slate-500 flex h-auto cursor-text select-none items-center justify-between gap-2 text-xs font-medium px-3 py-1.5 border-t border-slate-100 bg-slate-50/50 rounded-b-md",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last justify-end",
        "block-start": "order-first border-b border-t-0 rounded-b-none rounded-t-md",
        "block-end": "order-last border-t rounded-t-none rounded-b-md",
      },
    },
    defaultVariants: {
      align: "block-end",
    },
  }
)

function InputGroupAddon({
  className,
  align = "block-end",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-slate-500 flex items-center gap-2 text-xs",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        "flex min-h-[80px] w-full flex-1 resize-none rounded-b-none border-0 bg-transparent px-3 py-2.5 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
