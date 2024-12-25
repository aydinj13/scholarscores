"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type IndividualStats = {
  id: string
  student_id: string
  competition_id: string
  first_name: string
  minutes: number
  points: number
  assists: number
  /*
  rebounds: number
  fouls: number
  blocks: number
  steals: number
  */
}

export const columns: ColumnDef<IndividualStats>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
  },  
  {
    accessorKey: "competition_id",
    header: "Game ID",
  },
  {
    accessorKey: "first_name",
    header: "Name",
  },
  {
    accessorKey: "minutes",
    header: "Minutes",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "assists",
    header: "Assists",
  },
]
