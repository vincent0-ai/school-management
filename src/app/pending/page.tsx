"use client";

import { SignOutButton, useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PendingPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        const checkAutoApproval = async () => {
            const email = user?.emailAddresses[0]?.emailAddress;
            const role = user?.publicMetadata?.role;

            console.log("[Current User]:", email, "Role:", role);

            // 1. If user is already approved/student, just redirect (Break the loop)
            if (role === 'student' || user?.publicMetadata?.approved) {
                console.log("User already approved. Redirecting to dashboard...");
                router.push("/student");
                return;
            }

            // 2. Only trigger if NOT checking and email matches
            if (email?.endsWith("@students.jkuat.ac.ke") && !checking) {
                console.log("Email matches JKUAT domain, triggering auto-approve...");
                setChecking(true);
                try {
                    const res = await fetch("/api/auto-approve", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            email: email,
                        }),
                    });

                    console.log("Auto-approve response:", res.status);
                    if (res.ok) {
                        console.log("Approval success. Reloading user session...");
                        // 3. CRITICAL: Reload user session to get the new 'student' role in the token
                        await user.reload();

                        console.log("Session reloaded. Redirecting...");
                        // Use hard navigation to ensure cookies are refreshed for middleware
                        window.location.href = "/student";
                    }
                } catch (err) {
                    console.error("Auto approval failed", err);
                } finally {
                    setChecking(false);
                }
            } else if (!email?.endsWith("@students.jkuat.ac.ke")) {
                console.log("Email does NOT match JKUAT domain. No action.");
            }
        };

        if (user) {
            checkAutoApproval();
        }
    }, [user, router]); // 'checking' is state, managed internally. 'user' triggers updates.

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-lamaSkyLight p-4">
            <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col items-center gap-6 text-center max-w-md">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Image src="/logo.png" alt="" width={32} height={32} />
                    JKUAT School
                </h1>
                <div className="w-16 h-16 bg-lamaYellowLight rounded-full flex items-center justify-center">
                    <Image src="/announcement.png" alt="" width={32} height={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {checking ? "Verifying Account..." : "Account Pending Approval"}
                </h2>
                <p className="text-gray-500">
                    {checking
                        ? "We are checking your eligibility for auto-approval. Please wait."
                        : "Thank you for signing up! Your account is currently being reviewed by our administrators. You will be able to access the dashboard once your account is approved."
                    }
                </p>
                {!checking && (
                    <p className="text-sm text-gray-400 italic">
                        Please check back later.
                    </p>
                )}

                <div className="flex flex-col gap-2 mt-4">
                    <Link href="/" className="text-blue-500 underline text-sm">
                        Back to Dashboard
                    </Link>
                    <SignOutButton>
                        <button className="text-red-500 underline text-sm cursor-pointer">
                            Log Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
};

export default PendingPage;
