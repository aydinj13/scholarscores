import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import { Trophy, Home, LineChart, Users } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

interface Team {
  id: number;
  name: string;
  slug: string;
  wins: number;
  losses: number;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  grade: number;
  gender: string;
  slug: string;
  teams: Team;
  school_name: string;
}

interface IndividualStat {
  student_id: string;
  competition_name: string;
  competition_date: Date;
  points: number;
  minutes: number;
  assists: number;
  rebounds: number;
}

async function fetchStudentData(slug: string) {
  const { data, error } = await supabase
    .from("students")
    .select("*, teams(id, slug, name, wins, losses)")
    .eq("slug", slug);

  if (error) throw new Error(`Error fetching student data: ${error.message}`);
  return data?.[0];
}

async function getIndividualStats(studentId: string): Promise<IndividualStat[]> {
  const { data, error } = await supabase
    .from("individual_stats")
    .select(`
      *,
      competitions (competition_name: away_team, competition_date: date)
    `)
    .eq("student_id", studentId);

  if (error) {
    console.error("Error fetching individual stats:", error);
    return [];
  }

  // Transform the data to include competition_name and date directly in individualStats
  return data.map(stat => ({
    ...stat,
    competition_name: stat.competitions.competition_name,
        competition_date: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(stat.competitions.competition_date)),
  }));
}


export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch data
  const student: Student = await fetchStudentData(slug);
  if (!student) return <div>No student found with the given slug.</div>;

  const individualStats: IndividualStat[] = await getIndividualStats(student.id);

  return (
    <div>
      {/* Header Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${student.first_name}+${student.last_name}`} />
              <AvatarFallback>
                {student.first_name[0]}
                {student.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {student.first_name} {student.last_name}
              </h1>
              <p className="text-blue-100">Grade {student.grade} • {student.school_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-white">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Student Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{student.first_name} {student.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium">{student.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium">{student.slug}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Individual Statistics</h2>
                {individualStats.length ? (
                  <DataTable columns={columns} data={individualStats} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No individual stats available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Team Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{student.teams.name}</h3>
                      <p className="text-sm text-gray-500">
                        Record: {student.teams.wins}-{student.teams.losses}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/lakeridgeacademy/team/${student.teams.slug}`}>
                        View Team
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                <p className="text-gray-500">Achievements will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
