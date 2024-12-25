"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TeamStats = {
  id: string
  team_id: string
  competition_id: string
  field_goals_attempted: number
  field_goals_made: number
  three_pointers_attempted: number
  three_pointers_made: number
}

export const columns: ColumnDef<TeamStats>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "team_id",
    header: "Team ID",
  },  
  {
    accessorKey: "competition_id",
    header: "Competition ID",
  },
  {
    accessorKey: "field_goals_attempted",
    header: "FGA",
  },
  {
    accessorKey: "field_goals_made",
    header: "FGM",
  },
  {
    accessorKey: "three_pointers_attempted",
    header: "3PA",
  },
  {
    accessorKey: "three_pointers_made",
    header: "3PM",
  },
]
