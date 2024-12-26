"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-tl from-black to-blue-900">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="space-y-6 rounded-2xl bg-white bg-opacity-90 px-8 py-10 shadow-lg w-96"
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
            <h1 className="mt-4 text-xl font-medium tracking-tight text-gray-900">
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
              <Clerk.Label className="text-sm font-medium text-gray-900">
                Username
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-gray-100 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-blue-600 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-gray-900">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-gray-100 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-blue-600 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignIn.Action
            submit
            className="w-full rounded-md bg-blue-600 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-blue-600 hover:bg-blue-500 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:text-white/70"
          >
            Sign In
          </SignIn.Action>
          <p className="text-center text-sm text-gray-500">
            No account?{" "}
            <Clerk.Link
              navigate="sign-up"
              className="font-medium text-blue-600 decoration-blue-600/20 underline-offset-4 outline-none hover:text-blue-700 hover:underline focus-visible:underline"
            >
              Create an account
            </Clerk.Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
