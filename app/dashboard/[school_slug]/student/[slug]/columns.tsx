"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type IndividualStats = {
  student_id: string
  competition_name: string
  competition_date: Date
  points: number
  minutes: number
  assists: number
  rebounds: number
}

export const columns: ColumnDef<IndividualStats>[] = [
  {
    accessorKey: "competition_name",
    header: "Game"
  },
  {
    accessorKey: "competition_date",
    header: "Date"
  },
  {
    accessorKey: "points",
    header: "Points"
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