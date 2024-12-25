import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Dashboard() {
  return (
    <div>
      <div className="flex justify-end items-center p-5 lg:pr-10">
        <UserButton />
      </div>
      <p className="font-bold text-3xl ml-5">Dashboard</p>
      <div className="ml-5">
        <p className="my-5 font-bold">My Schools</p>
        <div className="grid grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle>Lake Ridge Academy</CardTitle>
                <CardDescription>Private School in North Ridgeville, OH.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>The Royals compete in many competitions, and are well known for their Robotics, Academic Challenge, and Cross Country teams.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
              <Link href="/dashboard/lakeridgeacademy">
                View Stats
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;