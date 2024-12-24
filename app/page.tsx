import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5">
      Landing Page
      <Button asChild>
      <Link href="/sign-in">
        Sign In
      </Link>
      </Button>
      <Button asChild>
      <Link href="/sign-up">
        Sign Up
      </Link>
      </Button>
    </div>
  )
}
