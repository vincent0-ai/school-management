"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
    const { signOut } = useClerk();
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            await signOut();
            router.push("/sign-in");
        };
        handleLogout();
    }, [signOut, router]);

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lamaPurple mx-auto mb-4"></div>
                <p className="text-gray-600">Signing out...</p>
            </div>
        </div>
    );
};

export default LogoutPage;
