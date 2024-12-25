"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";


export default function SignInPage() {
  return (
    <div className="grid w-full flex-grow items-center px-4 py-5 justify-center">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 w-96 "
        >
          <header className="text-center">
            <div className="mx-auto w-10 h-10">
              <Image
                src="/logo.png" // Path to your PNG logo in the public directory
                alt="Logo"
                width={40} // Adjust the width according to your needs
                height={40} // Adjust the height according to your needs
                className="object-contain rounded-lg" // Ensures the logo scales properly within its container
              />
            </div>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
              Sign in to Scholar <span className="text-blue-600">Scores</span>
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="grid grid-cols-1 gap-x-4">
            <Clerk.Connection name="google" asChild>
              <Button size="sm" type="button">
                <Clerk.Loading scope="provider:google">
                  {(isLoading) =>
                    isLoading ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Icons.google className="mr-2 size-4" />
                        Google
                      </>
                    )
                  }
                </Clerk.Loading>
              </Button>
            </Clerk.Connection>
          </div>
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">
                Username
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm  font-medium text-zinc-950">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignIn.Action
            submit
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Sign In
          </SignIn.Action>
          <p className="text-center text-sm text-zinc-500">
            No account?{" "}
            <Clerk.Link
              navigate="sign-up"
              className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
            >
              Create an account
            </Clerk.Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
