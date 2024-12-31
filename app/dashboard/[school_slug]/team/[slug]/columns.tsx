"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
 
export type TeamGameStats = {
  id: string
  competition_name: string
  competition_date: string
  field_goals_attempted: number
  field_goals_made: number
  three_pointers_attempted: number
  three_pointers_made: number
}
 
export const columns: ColumnDef<TeamGameStats>[] = [
  {
    accessorKey: "competition_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Game
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "competition_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "field_goals",
    header: "Field Goals",
    cell: ({ row }) => {
      const made = row.original.field_goals_made
      const attempted = row.original.field_goals_attempted
      const percentage = attempted > 0 ? ((made / attempted) * 100).toFixed(1) : "0.0"
      return `${made}/${attempted} (${percentage}%)`
    },
  },
  {
    accessorKey: "three_pointers",
    header: "3-Pointers",
    cell: ({ row }) => {
      const made = row.original.three_pointers_made
      const attempted = row.original.three_pointers_attempted
      const percentage = attempted > 0 ? ((made / attempted) * 100).toFixed(1) : "0.0"
      return `${made}/${attempted} (${percentage}%)`
    },
  },
]