"use client"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/supabaseClient";

async function getTeamStats(competition_id: string) {
  const { data, error } = await supabase
    .from("team_stats")
    .select("*, teams (name)")
    .eq("competition_id", competition_id);

  if (error) {
    console.error("Error fetching team stats:", error);
    return [];
  }

  return data;
}

async function getCompetitionData(competition_id: string) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competition_id);

  if (error) {
    console.error("Error fetching competition data:", error);
    return null;
  }

  return data;
}

function Competition({ params }: { params: { competition_id: string } }) {
  const { competition_id } = params;
  const [competitionData, setCompetitionData] = useState<any>(null);
  const [teamStats, setTeamStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch competition data
      const competition = await getCompetitionData(competition_id);
      setCompetitionData(competition);

      // Fetch team stats data
      const stats = await getTeamStats(competition_id);
      setTeamStats(stats);

      setLoading(false);
    };

    fetchData();
  }, [competition_id]);

  const formatDate = (date: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // For AM/PM format
    };

    const formattedDate = new Date(date).toLocaleString("en-US", options);
    return formattedDate;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!competitionData || competitionData.length === 0) {
    return <div>No competition data found.</div>;
  }

  return (
    <div>
      {competitionData.map((competition: any) => (
        <div key={competition.id}>
          <div className="p-5 text-2xl font-bold">
            <p>
              {competition.home_team}{" "}
              <span
                className={` ${
                  competition.home_score > competition.away_score
                    ? "text-zinc-700 font-bold"
                    : "text-zinc-500 font-medium"
                }`}
              >
                {competition.home_score}
              </span>
            </p>
            <p>
              {competition.away_team}{" "}
              <span
                className={` ${
                  competition.away_score > competition.home_score
                    ? "text-zinc-700 font-bold"
                    : "text-zinc-500 font-medium"
                }`}
              >
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
                <p>{formatDate(competition.date)}</p>
              </div>
            )}
          </div>
          <div className="space-y-1 p-5 text-zinc-500">
            <p>{competition.host_school}</p>
            <p>{competition.location}</p>
          </div>
        </div>
      ))}

      <p className="font-bold">Team Stats:</p>
      {teamStats.length > 0 ? (
        teamStats.map((stat) => (
          <div key={stat.id}>
            <p>Team Name: {stat.teams.name}</p>
            <p>3-Point Attempted: {stat.three_pointers_attempted}</p>
            <p>3-Point Made: {stat.three_pointers_made}</p>
            <p>3 Point Percentage: {Math.round(stat.three_pointers_made / stat.three_pointers_attempted * 100)}%</p>
          </div>
        ))
      ) : (
        <p>No team stats available.</p>
      )}
    </div>
  );
}

export default Competition;
