"use client";

import React, { useMemo, useState } from "react";
import { Edit01, MessageChatCircle } from "@/components/base/icons/untitledui";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard, type SortDescriptor } from "@/components/application/table/table";
import teamMembers from "@/components/application/table/team-members.json";
import { Avatar } from "@/components/base/avatar/avatar";
import type { BadgeTypes } from "@/components/base/badges/badge-types";
import { Badge, type BadgeColor, BadgeWithDot } from "@/components/base/badges/badges";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { DropdownIconSimple } from "@/components/base/dropdown/dropdown-icon-simple";

export const Table01DividerLine = () => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    const items = [...teamMembers.items];
    return items.sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];

      // Compare numbers or booleans
      if (
        (typeof first === "number" && typeof second === "number") ||
        (typeof first === "boolean" && typeof second === "boolean")
      ) {
        return sortDescriptor.direction === "descending" ? second - first : first - second;
      }

      // Compare strings
      if (typeof first === "string" && typeof second === "string") {
        let cmp = first.localeCompare(second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      }

      return 0;
    });
  }, [sortDescriptor]);

  return (
    <TableCard.Root>
      <TableCard.Header
        title="Hospital Medical Staff & Physicians"
        badge="Active Roster"
        contentTrailing={
          <div className="absolute top-4 right-4 md:right-6">
            <DropdownIconSimple />
          </div>
        }
      />
      <Table
        aria-label="Team members"
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header>
          <Table.Head
            id="name"
            label="Name"
            isRowHeader
            allowsSorting
            className="w-full max-w-1/4"
          />
          <Table.Head id="status" label="Status" allowsSorting />
          <Table.Head id="role" label="Role" allowsSorting tooltip="Hospital Clinical Role & Specialty" />
          <Table.Head
            id="email"
            label="Email address"
            allowsSorting
            className="hidden md:table-cell"
          />
          <Table.Head id="teams" label="Departments & Units" />
          <Table.Head id="actions" label="Actions" />
        </Table.Header>

        <Table.Body items={sortedItems}>
          {(item) => (
            <Table.Row key={item.id} id={item.username}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Avatar src={item.avatarUrl} alt={item.name} size="md" />
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">{item.username}</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <BadgeWithDot
                  size="sm"
                  color={item.status === "active" ? "success" : "gray"}
                  type="modern"
                >
                  {item.status === "active" ? "On Duty" : "Off Duty"}
                </BadgeWithDot>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                {item.role}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap hidden md:table-cell text-slate-600 dark:text-slate-400">
                {item.email}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1">
                  {item.teams.slice(0, 3).map((team) => (
                    <Badge
                      key={team.name}
                      color={team.color as BadgeColor<BadgeTypes>}
                      size="sm"
                    >
                      {team.name}
                    </Badge>
                  ))}

                  {item.teams.length > 3 && (
                    <Badge color="gray" size="sm">
                      +{item.teams.length - 3}
                    </Badge>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell className="px-4">
                <div className="flex justify-end gap-0.5">
                  <ButtonUtility size="xs" color="tertiary" tooltip="Page / Message Staff" icon={MessageChatCircle} />
                  <ButtonUtility size="xs" color="tertiary" tooltip="Edit Profile & Schedule" icon={Edit01} />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <PaginationPageMinimalCenter
        page={1}
        total={6}
        className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
      />
    </TableCard.Root>
  );
};

export default Table01DividerLine;
