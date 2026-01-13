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
        const role = user?.publicMetadata.role;

        if (role) {
            router.push(`/${role}`);
        }
    }, [user, router]);

    return (
        <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
            <SignUp.Root>
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
                        className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
                    >
                        Sign Up
                    </SignUp.Action>
                    <div className="text-sm mt-2 text-center">
                        Already have an account? <Link href="/sign-in" className="text-blue-500 underline">Sign in</Link>
                    </div>
                </SignUp.Step>
            </SignUp.Root>
        </div>
    );
};

export default SignUpPage;
