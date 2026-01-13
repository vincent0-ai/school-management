"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const SignUpPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            const role = user?.publicMetadata.role as string;
            router.push(`/${role || 'admin'}`);
        }
    }, [isLoaded, isSignedIn, user, router]);

    // Show loading while checking auth status
    if (!isLoaded || isSignedIn) {
        return (
            <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
            <SignUp.Root fallbackRedirectUrl="/admin">
                <SignUp.Step
                    name="start"
                    className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
                >
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Image src="/logo.png" alt="" width={24} height={24} />
                        JKUAT School
                    </h1>
                    <h2 className="text-gray-400">Create an account</h2>
                    <Clerk.GlobalError className="text-sm text-red-400" />

                    <Clerk.Field name="username" className="flex flex-col gap-2">
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

                    <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                        <Clerk.Label className="text-xs text-gray-500">
                            Email
                        </Clerk.Label>
                        <Clerk.Input
                            type="email"
                            required
                            className="p-2 rounded-md ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>

                    <Clerk.Field name="password" className="flex flex-col gap-2">
                        <Clerk.Label className="text-xs text-gray-500">
                            Password
                        </Clerk.Label>
                        <Clerk.Input
                            type="password"
                            required
                            className="p-2 rounded-md ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>

                    <SignUp.Action
                        submit
                        className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] hover:bg-blue-600 transition-colors"
                    >
                        Sign Up
                    </SignUp.Action>
                    <div className="text-sm mt-2 text-center">
                        Already have an account? <Link href="/" className="text-blue-500 underline">Sign in</Link>
                    </div>
                </SignUp.Step>

                {/* Email Verification Step */}
                <SignUp.Step
                    name="verifications"
                    className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4"
                >
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Image src="/logo.png" alt="" width={24} height={24} />
                        JKUAT School
                    </h1>
                    <h2 className="text-gray-400">Verify your email</h2>
                    <Clerk.GlobalError className="text-sm text-red-400" />

                    <SignUp.Strategy name="email_code">
                        <Clerk.Field name="code" className="flex flex-col gap-2">
                            <Clerk.Label className="text-xs text-gray-500">
                                Enter the code sent to your email
                            </Clerk.Label>
                            <Clerk.Input
                                type="text"
                                required
                                className="p-2 rounded-md ring-1 ring-gray-300"
                            />
                            <Clerk.FieldError className="text-xs text-red-400" />
                        </Clerk.Field>
                        <SignUp.Action
                            submit
                            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] hover:bg-blue-600 transition-colors"
                        >
                            Verify
                        </SignUp.Action>
                    </SignUp.Strategy>
                </SignUp.Step>
            </SignUp.Root>
        </div>
    );
};

export default SignUpPage;
