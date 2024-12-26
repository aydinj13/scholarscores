"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-10">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="space-y-8 rounded-2xl bg-white bg-opacity-90 shadow-xl p-8 sm:w-96 w-full"
        >
          <header className="text-center">
            <div className="mx-auto w-14 h-14 mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Create an Account</h1>
          </header>
          <Clerk.GlobalError className="text-center text-sm text-red-500" />
          <div className="space-y-6">
            <Clerk.Connection name="google" asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full flex justify-center items-center bg-white text-gray-800 hover:bg-gray-100"
              >
                <Clerk.Loading scope="provider:google">
                  {(isLoading) =>
                    isLoading ? (
                      <Icons.spinner className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <>
                        <Icons.google className="mr-2 w-5 h-5 text-blue-500" />
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
              <Clerk.Label className="text-sm font-medium text-gray-700">
                Email Address
              </Clerk.Label>
              <Clerk.Input
                type="email"
                required
                className="w-full rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-gray-700">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>
          </div>
          <SignUp.Action
            submit
            className="w-full rounded-md bg-blue-600 text-white py-2 text-center font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </SignUp.Action>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </SignUp.Step>

        <SignUp.Step
          name="verifications"
          className="space-y-8 rounded-2xl bg-white bg-opacity-90 shadow-xl p-8 sm:w-96 w-full"
        >
          <header className="text-center">
            <div className="mx-auto w-14 h-14 mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Verify Your Email</h1>
          </header>
          <Clerk.GlobalError className="text-center text-sm text-red-500" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-gray-700">
                Email Code
              </Clerk.Label>
              <Clerk.Input
                required
                className="w-full rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="w-full rounded-md bg-blue-600 text-white py-2 text-center font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Finish Registration
            </SignUp.Action>
          </SignUp.Strategy>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}
