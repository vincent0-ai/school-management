"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata.role as string;
      const approved = user?.publicMetadata.approved as boolean;

      console.log("LOGIN DEBUG: role:", role, "approved:", approved);

      if (role === 'admin' || approved) {
        console.log("Redirecting to:", `/${role || 'admin'}`);
        router.push(`/${role || 'admin'}`);
      } else {
        router.push('/pending');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading while checking auth status
  if (!isLoaded || isSignedIn) {
    return (
      <div className="h-screen flex flex-col gap-4 items-center justify-center bg-lamaSkyLight">
        <div className="text-gray-500">
          Redirecting... ({user?.publicMetadata?.role as string || "checking"})
        </div>
        <SignOutButton>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
            Sign Out / Try Again
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root fallbackRedirectUrl="/admin">
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            JKUAT School
          </ h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <div className="relative">
              <Clerk.Input
                type={showPassword ? "text" : "password"}
                required
                className="p-2 rounded-md ring-1 ring-gray-300 w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Image
                  src="/view.png"
                  alt=""
                  width={16}
                  height={16}
                  className={showPassword ? "" : "opacity-50"}
                />
              </button>
            </div>
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] hover:bg-blue-600 transition-colors"
          >
            Sign In
          </SignIn.Action>
          <div className="text-sm mt-2 text-center">
            Don't have an account? <a href="/sign-up" className="text-blue-500 underline">Sign up</a>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;