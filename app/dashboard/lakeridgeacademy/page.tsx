import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function SchoolPage() {
  return (
    <div>
    <div className="banner-container">
    <Image
      src="https://bbk12e1-cdn.myschoolcdn.com/2381/photo/orig_photo682601_5736593.jpg?"
      alt="Banner Image"
      width={1200}
      height={300}
      layout="responsive"
      priority
    />
  </div>
  <div className="flex items-center p-5">
  <Avatar className="w-14 h-12">
    <AvatarImage src="https://bbk12e1-cdn.myschoolcdn.com/ftpimages/2381/logo/LakeRidgeLogoColor.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <p className="ml-4 text-3xl font-bold">Lake Ridge Academy</p>
  <Badge className="ml-3 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 font-semibold shadow-md hover:bg-yellow-500">
    Gold
  </Badge>
  <div>
  </div>
</div>
<div className="ml-5">
<p className="text-xl font-bold mb-5">Teams</p>
<div className="grid grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle>🏀 Middle School Boys Basketball</CardTitle>
                <CardDescription><span className="font-bold">Record:</span> 12-2</CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Button asChild>
              <Link href="/dashboard/lakeridgeacademy/team/ms-boys-basketball">
                View Team
                </Link>
              </Button>
              <Button asChild>
              <Link href="/dashboard/lakeridgeacademy/insert-data">
                Insert Stats
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
</div>
  </div>
  )
}
export default SchoolPage