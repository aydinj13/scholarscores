import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import { Home, Users, Phone } from "lucide-react";
import { Coach } from "@/lib/types";



async function fetchCoachData(slug: string) {
  const { data, error } = await supabase
    .from("coaches")
    .select(`
      *,
      teams(id, slug, name, wins, losses),
      school:schools(name, slug)
    `)
    .eq("slug", slug);

  if (error) throw new Error(`Error fetching coach data: ${error.message}`);
  return data?.[0];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const coach: Coach = await fetchCoachData(slug);
  if (!coach) return <div>No coach found with the given slug.</div>;

  return (
    <div>
      {/* Header Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${coach.first_name}+${coach.last_name}`} />
              <AvatarFallback>
                {coach.first_name[0]}
                {coach.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {coach.first_name} {coach.last_name}
              </h1>
              <p className="text-blue-100">{coach.title} • <Link href={`/dashboard/${coach.school.slug}`}>{coach.school.name}</Link></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-4 bg-white">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">About</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{coach.title}</p>
                  </div>
                  {coach.bio && (
                    <div>
                      <p className="text-sm text-gray-500">Biography</p>
                      <p className="font-medium">{coach.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Teams</h2>
                <div className="space-y-4">
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{coach.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{coach.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}