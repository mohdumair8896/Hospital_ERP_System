import * as React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DropdownIconSimple() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <span className="sr-only">Open options</span>
            <MoreVertical className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48 text-xs">
        <DropdownMenuLabel className="text-xs">Table Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => {}}>Export records (CSV)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Print table summary</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>Refresh data stream</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Configure table columns</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownIconSimple;
