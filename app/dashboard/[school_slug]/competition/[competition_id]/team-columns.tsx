"use client"

import { ColumnDef } from "@tanstack/react-table"

export type TeamStats = {
    id: string
    team_id: string
    team_name: string
    field_goals_attempted: number
    field_goals_made: number
    three_pointers_attempted: number
    three_pointers_made: number
  }

export const team_columns: ColumnDef<TeamStats>[] = [
    {
      accessorKey: "team_name",
      header: "Team"
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
  