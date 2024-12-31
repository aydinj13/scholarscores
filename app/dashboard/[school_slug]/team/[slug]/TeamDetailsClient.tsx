"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, Calendar, Trophy, LineChart } from "lucide-react";
import Link from "next/link";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  slug: string;
}

interface TeamData {
  id: number;
  name: string;
  sport: string;
  age: "ms" | "hs";
  gender: "boys" | "girls";
  wins: number;
  losses: number;
  description?: string;
}


interface Competition {
  id: number;
  competition_date: string;
  away_team: string;
  home_team: string;
  location: string;
  is_win?: boolean | null;
}

export default function TeamDetailsClient({
  teamData,
  roster,
  schedule,
}: {
  teamData: TeamData;
  roster: Student[];
  schedule: Competition[];
}) {
  const getTeamInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const getSportEmoji = (sport: string): string => {
    const emojiMap: { [key: string]: string } = {
      basketball: "🏀",
      soccer: "⚽",
      baseball: "⚾",
      volleyball: "🏐",
      default: "🏅",
    };

    return emojiMap[sport.toLowerCase()] || emojiMap.default;
  };

  const formatCompetitionStatus = (
    competitionDate: string,
    isWin: boolean | null
  ) => {
    const now = new Date();
    const compDate = new Date(competitionDate);
  
    // If competition is today and not completed, show "Live"
    if (compDate.toDateString() === now.toDateString() && isWin === null) {
      return <span className="bg-red-600 text-white px-2 py-1 rounded">Live</span>;
    }
  
    // If competition date is in the past, check for win/loss status
    if (compDate < now) {
      if (isWin === null) {
        return <span className="text-gray-500">No result yet</span>;
      }
      return (
        <span className={isWin ? "font-bold text-green-600" : "font-bold text-red-600"}>
          {isWin ? "W" : "L"}
        </span>
      );
    }
  
    // Otherwise, mark it as upcoming
    return <span className="bg-blue-600 text-white px-2 py-1 rounded">Upcoming</span>;
  };

  const sortedSchedule = [...schedule].sort(
    (a, b) => new Date(a.competition_date).getTime() - new Date(b.competition_date).getTime()
  );

  return (
    <div>
      {/* Header Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarFallback className="text-xl font-bold">
                {getTeamInitials(teamData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{getSportEmoji(teamData.sport)}</span>
                <h1 className="text-3xl font-bold">{teamData.name}</h1>
              </div>
              <p className="text-blue-100">
                {teamData.age === "ms" ? "Middle School" : "High School"} {" "}
                {teamData.gender === "boys" ? "Boys" : "Girls"} {teamData.sport} • {}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-blue-700 rounded-full">
                  Record: {teamData.wins}-{teamData.losses}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-5 gap-4 bg-white">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Roster
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Team Stats
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">About the Team</h2>
                <p className="text-gray-700">
                  {teamData.description || "No additional information available for this team."}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Season Record</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {teamData.wins}-{teamData.losses}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Win Percentage</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {((teamData.wins / (teamData.wins + teamData.losses)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roster">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Team Roster</h2>
                  <Button variant="outline">Download Roster</Button>
                </div>
                {roster.length > 0 ? (
                  <div className="divide-y">
                    {roster.map((student) => (
                      <div key={student.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/dashboard/lakeridgeacademy/student/${student.slug}`}
                              className="font-medium hover:text-blue-600 transition-colors"
                            >
                              {student.first_name} {student.last_name}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {student.position}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" asChild>
                          <Link href={`/dashboard/lakeridgeacademy/student/${student.slug}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No students in this team.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Team Schedule</h2>
                {sortedSchedule.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {sortedSchedule.map((comp) => (
  <div
    key={comp.id}
    className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-lg font-medium">
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(comp.competition_date))}
        </p>
        <p className="text-gray-700">
          {comp.away_team} @ {comp.home_team}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {formatCompetitionStatus(
          comp.competition_date,
          comp.is_win!  // This will now be properly typed
        )}
        <Button variant="outline" asChild>
          <Link href={`/dashboard/lakeridgeacademy/competition/${comp.id}`}>
            View Matchup
          </Link>
        </Button>
      </div>
    </div>
  </div>
))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No scheduled competitions.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Team Statistics</h2>
                <p className="text-gray-500 text-center py-8">Team statistics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Team Achievements</h2>
                <p className="text-gray-500 text-center py-8">Team achievements will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

