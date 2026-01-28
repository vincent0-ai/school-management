"use client";

import { SignOutButton, useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { updateUserRole } from "@/lib/actions";

const PendingPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const [checking, setChecking] = useState(false);

    // Check if role exists
    const currentRole = user?.unsafeMetadata?.role || user?.publicMetadata?.role;

    const [state, formAction] = useFormState(updateUserRole, { success: false, error: false });

    useEffect(() => {
        if (state.success) {
            user?.reload();
        }
    }, [state.success, user]);

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
                        await user.reload();
                        window.location.href = "/student";
                    }
                } catch (err) {
                    console.error("Auto approval failed", err);
                } finally {
                    setChecking(false);
                }
            }
        };

        if (user) {
            checkAutoApproval();
        }
    }, [user, router, checking]);

    const handleRoleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const role = formData.get("role") as string;
        formAction({ userId: user?.id!, role });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-lamaSkyLight p-4">
            <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col items-center gap-6 text-center max-w-md w-full">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Image src="/logo.png" alt="" width={32} height={32} />
                    JKUAT School
                </h1>

                {!currentRole ? (
                    <>
                        <div className="w-16 h-16 bg-lamaSky rounded-full flex items-center justify-center">
                            <Image src="/announcement.png" alt="" width={32} height={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Almost there!
                        </h2>
                        <p className="text-gray-500">
                            Please select your role to proceed with the registration.
                        </p>
                        <form onSubmit={handleRoleSubmit} className="flex flex-col gap-4 w-full">
                            <select
                                name="role"
                                required
                                className="p-2 rounded-md ring-1 ring-gray-300 text-sm"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="parent">Parent</option>
                            </select>
                            <button
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                                disabled={state.success}
                            >
                                {state.success ? "Saving..." : "Save Selection"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default PendingPage;
