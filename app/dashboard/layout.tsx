import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Scholar Scores",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkLoaded>
    <div>
      <Header />
      {children}
    </div>
    </ClerkLoaded>
  )
}
