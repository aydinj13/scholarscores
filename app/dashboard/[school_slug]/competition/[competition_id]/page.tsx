"use client"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/supabaseClient";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { team_columns } from "./team-columns";
import { Trophy, MapPin, CalendarDays, Users, ChartBar, School } from "lucide-react";
import Link from "next/link"

interface Competition {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  home_bonus: boolean;
  away_bonus: boolean;
  slug: string;
  live: boolean;
  quarter?: number;
  time?: string;
  date: string;
  host_school: string;
  location: string;
  description: string;
  gender: "boys" | "girls";
  age: "ms" | "hs";
  sport: "basketball" | "soccer" | "football";
}

interface IndividualStat {
  id: string;
  competition_id: string;
  student_id: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  student_name: string;
}

interface TeamStat {
  id: string;
  team_id: string;
  team_name: string;
  field_goals_attempted: number;
  field_goals_made: number;
  three_pointers_attempted: number;
  three_pointers_made: number;
}

async function getCompetitionData(competition_id: string) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*, teams (slug, gender, age, sport)")
    .eq("id", competition_id);

  if (error) {
    console.error("Error fetching competition data:", error);
    throw error;
  }

  return data.map(competition => ({
    ...competition,
    gender: competition.teams?.gender || "N/A",
    age: competition.teams?.age || "N/A",
    sport: competition.teams?.sport || "N/A",
  }));
}


async function getIndividualStats(competition_id: string): Promise<IndividualStat[]> {
  const { data, error } = await supabase
    .from("individual_stats")
    .select("*, students(first_name, last_name, slug, school_id)")
    .eq("competition_id", competition_id);

  if (error) {
    console.error("Error fetching individual stats:", error);
    return [];
  }

  return data.map(stat => ({
    ...stat,
    student_name: `${stat.students?.first_name} ${stat.students?.last_name}`,
  }));
}

async function getTeamStats(competition_id: string): Promise<TeamStat[]> {
  const { data, error } = await supabase
    .from("team_stats")
    .select("*, teams(name)")
    .eq("competition_id", competition_id);

  if (error) {
    console.error("Error fetching team stats:", error);
    return [];
  }

  return data.map(stat => ({
    ...stat,
    team_name: `${stat.teams?.name}`,
  }));
}

async function updateTeamResults(competition_id: string) {
  // Fetch competition data to get home and away scores and team IDs
  const { data: competition, error: competitionError } = await supabase
    .from("competitions")
    .select("*, home_team, away_team, home_score, away_score")
    .eq("id", competition_id)
    .single();

  if (competitionError) {
    console.error("Error fetching competition data:", competitionError);
    return;
  }

  const homeTeamId = competition.home_team_id; // Assuming you have home_team_id field for team reference
  const awayTeamId = competition.away_team_id; // Assuming you have away_team_id field for team reference
  const homeScore = competition.home_score;
  const awayScore = competition.away_score;

  let homeTeamResult: "win" | "loss" = "loss"; // Default to loss for home team
  let awayTeamResult: "win" | "loss" = "loss"; // Default to loss for away team

  // Determine the result for home and away teams based on scores
  if (homeScore > awayScore) {
    homeTeamResult = "win";
    awayTeamResult = "loss";
  } else if (homeScore < awayScore) {
    homeTeamResult = "loss";
    awayTeamResult = "win";
  }

  // Update home team wins/losses
  const { error: homeUpdateError } = await supabase
    .from("teams")
    .update({
      wins: competition.teams?.home_team_id?.wins + (homeTeamResult === "win" ? 1 : 0),
      losses: competition.teams?.home_team_id?.losses + (homeTeamResult === "loss" ? 1 : 0),
    })
    .eq("id", homeTeamId);

  if (homeUpdateError) {
    console.error("Error updating home team record:", homeUpdateError);
  }

  // Update away team wins/losses
  const { error: awayUpdateError } = await supabase
    .from("teams")
    .update({
      wins: competition.teams?.away_team_id?.wins + (awayTeamResult === "win" ? 1 : 0),
      losses: competition.teams?.away_team_id?.losses + (awayTeamResult === "loss" ? 1 : 0),
    })
    .eq("id", awayTeamId);

  if (awayUpdateError) {
    console.error("Error updating away team record:", awayUpdateError);
  }
}


export default function Competition({ params }: { params: { competition_id: string } }) {
  const [competitionData, setCompetitionData] = useState<Competition[]>([]);
  const [individualStats, setIndividualStats] = useState<IndividualStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [previousHomeScore, setPreviousHomeScore] = useState<number | null>(null);
  const [previousAwayScore, setPreviousAwayScore] = useState<number | null>(null);

  const [homeScoreChange, setHomeScoreChange] = useState<number | null>(null);
  const [awayScoreChange, setAwayScoreChange] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competitionData = await getCompetitionData(params.competition_id);
        setCompetitionData(competitionData);
        await updateTeamResults(params.competition_id);

        const statsData = await getIndividualStats(params.competition_id);
        if (statsData) {
          setIndividualStats(statsData);
        } else {
          setError("No individual stats found for this competition.");
        }

        const teamStatsData = await getTeamStats(params.competition_id);
        if (teamStatsData) {
          setTeamStats(teamStatsData);
        } else {
          setError("No team stats found for this competition.");
        }
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching competition or stats:", error);
        console.error("Error updating team results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const competitionSubscription = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "competitions",
        },
        (payload) => {
          const updatedCompetition = payload.new;
          setCompetitionData((prevData) =>
            prevData.map((competition) =>
              competition.id === updatedCompetition.id ? updatedCompetition : competition
            )
          );

          if (updatedCompetition.home_score !== previousHomeScore) {
            setHomeScoreChange(updatedCompetition.home_score - (previousHomeScore || 0));
            setPreviousHomeScore(updatedCompetition.home_score);
            setTimeout(() => setHomeScoreChange(null), 3000);
          }

          if (updatedCompetition.away_score !== previousAwayScore) {
            setAwayScoreChange(updatedCompetition.away_score - (previousAwayScore || 0));
            setPreviousAwayScore(updatedCompetition.away_score);
            setTimeout(() => setAwayScoreChange(null), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      competitionSubscription.unsubscribe();
    };
  }, [params.competition_id, previousHomeScore, previousAwayScore]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse space-y-4 text-center">
        <div className="text-2xl font-bold text-gray-600">Loading Competition Data</div>
        <div className="text-gray-500">Please wait...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="text-xl text-red-600">{error}</div>
        <div className="text-gray-600">Please try again later</div>
      </div>
    </div>
  );

  if (!competitionData?.length) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">No competition data found.</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {competitionData.map(competition => (
        <div key={competition.id} className="space-y-8">
          {/* Scoreboard Card */}
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Home Team */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold"><Link href={`/dashboard/lakeridgeacademy/team/${competition.slug}`}>{competition.home_team}</Link></div>
                  <div className="text-4xl font-bold text-blue-600">
                    {competition.home_score}
                    {homeScoreChange !== null && (
                      <span className="text-green-500 ml-2 text-2xl animate-pulse">
                        +{homeScoreChange}
                      </span>
                    )}
                  </div>
                  {competition.home_bonus && (
                    <Badge className="bg-blue-100 text-blue-800">BONUS</Badge>
                  )}
                </div>

                {/* Game Status */}
                <div className="text-center space-y-4">
                  {competition.live ? (
                    <div className="space-y-2">
                      <Badge variant="destructive" className="animate-pulse px-4 py-2">
                        LIVE
                      </Badge>
                      <div className="text-xl font-semibold">
                        Q{competition.quarter} • {competition.time}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Badge className="px-4 py-2">FINAL</Badge>
                      <div className="flex items-center justify-center text-gray-600">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {new Date(competition.date).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">{competition.away_team}</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {competition.away_score}
                    {awayScoreChange !== null && (
                      <span className="text-green-500 ml-2 text-2xl animate-pulse">
                        +{awayScoreChange}
                      </span>
                    )}
                  </div>
                  {competition.away_bonus && (
                    <Badge className="bg-blue-100 text-blue-800">BONUS</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Game Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">{competition.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {competition.age.toUpperCase()} • {competition.gender.charAt(0).toUpperCase() + competition.gender.slice(1)} • {competition.sport.charAt(0).toUpperCase() + competition.sport.slice(1)}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {competition.location}
                </div>
                <div className="flex items-center">
                  <School className="w-4 h-4 mr-2" />
                  {competition.host_school}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Individual Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Individual Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {individualStats.length ? (
                  <DataTable columns={columns} data={individualStats} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No individual stats available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="w-5 h-5 mr-2" />
                  Team Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamStats.length ? (
                  <DataTable columns={team_columns} data={teamStats} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No team stats available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}