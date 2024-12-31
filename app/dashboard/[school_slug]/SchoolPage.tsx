import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, CalendarDays, ArrowRight, MapPin, PersonStanding, BusIcon } from "lucide-react";
import Link from "next/link";
import { School, Team, Competition } from "@/lib/types"; // You'll need to create these types

interface SchoolPageProps {
  schoolData: School;
  teamsData: Team[];
  competitionsData: Competition[];
}

export default function SchoolPageClient({ 
  schoolData, 
  teamsData, 
  competitionsData 
}: SchoolPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80">
        <Image
          src={`https://srbmzorcnpedbbmgowqe.supabase.co/storage/v1/object/public/school-media/${schoolData.banner_url}`}
          alt="Banner Image"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage
                src={`https://srbmzorcnpedbbmgowqe.supabase.co/storage/v1/object/public/school-media/${schoolData.logo_url}`}
                alt="Logo"
              />
              <AvatarFallback className="text-2xl">{schoolData.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{schoolData.name}</h1>
                {schoolData.annual_fee_paid && (
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                    GOLD MEMBER
                  </Badge>
                )}
              </div>
              <p className="text-gray-200 max-w-2xl">{schoolData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Competitions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            {teamsData?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamsData.map((team) => (
                   <Card key={team.id} className="hover:shadow-lg transition-shadow">
                   <CardHeader>
                     <CardTitle className="flex items-center justify-between">
                       <span>{team.name}</span>
                       <Badge variant="outline" className="ml-2">
                         {team.sport}
                       </Badge>
                     </CardTitle>
                     <CardDescription className="flex items-center gap-4">
                       <span className="flex items-center gap-1">
                         <Trophy className="w-4 h-4 text-yellow-500" />
                         {team.wins}-{team.losses}
                       </span>
                     </CardDescription>
                   </CardHeader>
                   <CardFooter>
                     <Button asChild className="w-full">
                       <Link href={`/dashboard/${schoolData.slug}/team/${team.slug}`}>
                         View Team Details
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Link>
                     </Button>
                   </CardFooter>
                 </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <Users className="w-12 h-12 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">No teams created</h3>
                    <p className="text-gray-500">There are currently no teams for this school.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competitions">
  {competitionsData?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitionsData.map((competition) => (
        <Card key={competition.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">
                {competition.home_team} vs {competition.away_team}
              </CardTitle>
              {competition.live && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE - Q{competition.quarter}
                </Badge>
              )}
            </div>
            <CardDescription className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(competition.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <PersonStanding className="w-4 h-4" />
                <span>{competition.teams.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <BusIcon className="w-4 h-4" />
                <span>{`${competition.teams.age.toUpperCase()} ${competition.teams.gender} ${competition.teams.sport}`}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{competition.description}</p>
          </CardContent>
          <CardFooter>
            <Button variant="default" asChild className="w-full">
              <Link href={`/dashboard/${schoolData.slug}/competition/${competition.id}`}>
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card className="text-center py-8">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Trophy className="w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">No competitions scheduled</h3>
          <p className="text-gray-500">There are currently no competitions for this school.</p>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}