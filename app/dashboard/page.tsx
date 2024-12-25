import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/supabaseClient";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

async function Dashboard() {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('name', 'Lake Ridge Academy');

  if (error) {
    console.error('Error fetching schools:', error);
    return <div>Error loading schools</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-end items-center p-5 lg:pr-10">
        <UserButton />
      </div>
      <p className="font-bold text-3xl ml-5">Dashboard</p>
      <div className="ml-5">
        <p className="my-5 font-bold">My Schools</p>
        <div className="grid grid-cols-3 gap-8">
          {data.map((school) => (
            <Card key={school.id}>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle>{school.name}</CardTitle>
                  <CardDescription>Private School in North Ridgeville, OH.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{school.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/dashboard/lakeridgeacademy">
                    View Stats
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/lakeridgeacademy/competition/">
                    View Latest Competition
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;