"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Search from "./Search";
import { ClipboardEdit, Medal, School, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { PlusCircle, Users } from "lucide-react";
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

function Header() {
    const { user } = useUser();
    const role = user?.publicMetadata?.role;
  return (
    <header className="flex items-center justify-between p-4 lg:p-6 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/dashboard">
        <Image
          src="/logo.png"
          alt="logo"
          width={25}
          height={25}
          className="w-8 h-8"
          priority
        />
        </Link>
        
        <h1 className="text-lg font-semibold text-gray-700 ml-2 hidden sm:block">
          Scholar Scores
        </h1>

      </div>

      {/* Search */}
      <div className="flex-1 w-2xl mx-4">
        <Search placeholder="Search schools..." />
      </div>
{role === "manager"  && (
    <div className="mx-2">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 rounded-full bg-white  hover:bg-gray-100 hover:border-gray-300"
        >
          <PlusCircle className="h-5 w-5 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white outline-black" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-1 p-2">
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 focus:bg-gray-100" asChild>
          <Link href="/dashboard/lakeridgeacademy/team/new">
            <Users className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="font-medium">New Team</span>
              <span className="text-xs text-gray-500">Create a new team profile</span>
            </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900" asChild>
            <Link href="/dashboard/lakeridgeacademy/competition/new">
            <Trophy className="h-4 w-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="font-medium">New Competition</span>
              <span className="text-xs text-gray-500">Start a new competition</span>
            </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900" asChild>
          <Link href="/dashboard/lakeridgeacademy/team/update">
            <ClipboardEdit className="h-4 w-4 text-green-500" />
            <div className="flex flex-col">
              <span className="font-medium">Update Team</span>
              <span className="text-xs text-gray-500">Modify existing team details</span>
            </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900" asChild>
          <Link href="/dashboard/lakeridgeacademy/competition/update">
            <Medal className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="font-medium">Update Competition</span>
              <span className="text-xs text-gray-500">Edit competition settings</span>
            </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900" asChild>
          <Link href="/school/new">
            <School className="h-4 w-4 text-red-500" />
            <div className="flex flex-col">
              <span className="font-medium">New School</span>
              <span className="text-xs text-gray-500">Register a local school with Scholar Scores.</span>
            </div>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
      </div>
)}
      
    
      <UserButton />
    </header>
  );
}

export default Header;