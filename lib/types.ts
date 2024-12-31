// types.ts

export interface Coach {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  slug: string;
  school_id: number;
  team_id: number;
  school: {
    name: string;
    slug: string;
  };
}

export interface School {
    id: string;
    name: string;
    slug: string;
    description: string;
    banner_url: string;
    logo_url: string;
    annual_fee_paid: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Team {
    id: string;
    name: string;
    slug: string;
    sport: "basketball" | "soccer" | "volleyball" | "football";
    wins: number;
    losses: number;
    school_id: string;
    coach_id: number;
    age: "ms" | "hs";
    gender: "boys" | "girls";
    created_at: string;
    updated_at: string;
  }


  export interface Competition {
    id: string;
    date: string; // Or use Date if you prefer working with Date objects
    location: string | null;
    created_at: string;
    home_score: number | null;
    away_score: number | null;
    live: boolean | null;
    quarter: number | null;
    time: string | null;
    home_bonus: boolean | null;
    away_bonus: boolean | null;
    description: string | null;
    is_win: boolean | null;
    away_team: string | null; // Away team name or identifier
    team_id: string | null; // Reference to the team
    host_school: string | null;
    home_team: string | null; // Home team name or identifier
  }
  
  
  // You might also want to create some utility types
  export type SportType = "basketball" | "soccer" | "volleyball" | "football";
  export type AgeGroup = "ms" | "hs";
  export type Gender = "boys" | "girls";
  export type CompetitionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
  
  // Response types for Supabase queries
  export interface SupabaseResponse<T> {
    data: T | null;
    error: Error | null;
  }