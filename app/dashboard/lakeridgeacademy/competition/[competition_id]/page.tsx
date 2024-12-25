"use client"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/supabaseClient";

interface Competition {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  live: boolean;
  quarter?: number;
  time?: string;
  date: string;
  host_school: string;
  location: string;
}

async function getCompetitionData(competition_id: string) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competition_id);

  if (error) throw error;
  return data;
}

export default function Competition({ params }: { params: { competition_id: string } }) {
  const [competitionData, setCompetitionData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompetitionData(params.competition_id)
      .then(setCompetitionData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.competition_id]);

  if (loading) return <div>Loading...</div>;
  if (!competitionData?.length) return <div>No competition data found.</div>;

  return (
    <div>
      {competitionData.map(competition => (
        <div key={competition.id}>
          <div className="p-5 text-2xl font-bold">
            <p>
              {competition.home_team}{" "}
              <span className={competition.home_score > competition.away_score 
                ? "text-zinc-700 font-bold" 
                : "text-zinc-500 font-medium"
              }>
                {competition.home_score}
              </span>
            </p>
            <p>
              {competition.away_team}{" "}
              <span className={competition.away_score > competition.home_score 
                ? "text-zinc-700 font-bold" 
                : "text-zinc-500 font-medium"
              }>
                {competition.away_score}
              </span>
            </p>
          </div>

          <div className="pl-5">
            {competition.live ? (
              <div className="flex space-x-2">
                <Badge variant="destructive">Live</Badge>
                <p>Q{competition.quarter}</p>
                <p>{competition.time}</p>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Badge>Final</Badge>
                <p>{new Date(competition.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}</p>
              </div>
            )}
          </div>

          <div className="space-y-1 p-5 text-zinc-500">
            <p>{competition.host_school}</p>
            <p>{competition.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}