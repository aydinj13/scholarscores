import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard | Scholar Scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
        <UserButton />
        {children}
      </body>
    </html>
  );
}
