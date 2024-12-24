"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="grid w-full flex-grow items-center px-4 py-5 justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="space-y-6 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-neutral/2 w-96 "
        >
          <header className="text-center">
            <div className="mx-auto w-10 h-10">
              <Image
                src="/logo.png" // Path to your PNG logo in the public directory
                alt="Logo"
                width={30} // Adjust the width according to your needs
                height={30} // Adjust the height according to your needs
                className="object-contain rounded-lg" // Ensures the logo scales properly within its container
              />
            </div>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-black">
              Create an account
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
            <Clerk.Field name="emailAddress" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-black">
                Email address
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-black">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignUp.Action
            submit
            className="relative isolate w-full rounded-md bg-blue-600 px-3.5 py-1.5 text-center text-sm font-medium text-black shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-black/70 active:before:bg-black/10"
          >
            Sign Up
          </SignUp.Action>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-black decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </Link>
          </p>
        </SignUp.Step>
        <SignUp.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
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
            <h1 className="mt-4 text-xl font-medium tracking-tight text-black">
              Verify email code
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-black">
                Email code
              </Clerk.Label>
              <Clerk.Input
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-black shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-black/70 active:before:bg-black/10"
            >
              Finish registration
            </SignUp.Action>
          </SignUp.Strategy>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-black decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}
