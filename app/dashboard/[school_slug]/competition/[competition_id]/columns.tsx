"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type IndividualStats = {
  student_id: string
  student_name: string
  points: number
  minutes: number
  assists: number
  rebounds: number
}

export const columns: ColumnDef<IndividualStats>[] = [
  {
    accessorKey: "student_name",
    header: "Player"
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "minutes",
    header: "Minutes",
  },
  {
    accessorKey: "assists",
    header: "Assists",
  },
  {
    accessorKey: "rebounds",
    header: "Rebounds",
  },
]