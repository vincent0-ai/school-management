import { getCurrentUserRole } from "@/lib/auth";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
    const { role, userId } = await getCurrentUserRole();
    const clerkUser = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    // Get user data
    let userData: any = null;
    if (role === "student") {
        userData = await prisma.student.findUnique({ where: { id: userId } });
    } else if (role === "teacher") {
        userData = await prisma.teacher.findUnique({ where: { id: userId } });
    } else if (role === "parent") {
        userData = await prisma.parent.findUnique({ where: { id: userId } });
    } else if (role === "admin") {
        userData = await prisma.admin.findUnique({ where: { id: userId } });
    }

    return (
        <div className="flex-1 p-4">
            <div className="bg-white rounded-md p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Settings</h1>

                {/* Account Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
                        Account
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-gray-500">
                                    {clerkUser?.emailAddresses?.[0]?.emailAddress || userData?.email || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">Username</p>
                                <p className="text-sm text-gray-500">
                                    {clerkUser?.username || userData?.username || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">Role</p>
                                <p className="text-sm text-gray-500 capitalize">{role}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
                        Profile
                    </h2>
                    <div className="space-y-4">
                        <Link
                            href="/profile"
                            className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">View Profile</p>
                                    <p className="text-sm text-gray-500">
                                        See your full profile details
                                    </p>
                                </div>
                                <span className="text-gray-400">→</span>
                            </div>
                        </Link>

                        {role !== "admin" && (
                            <Link
                                href="/complete-profile"
                                className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">Edit Profile</p>
                                        <p className="text-sm text-gray-500">
                                            Update your profile information
                                        </p>
                                    </div>
                                    <span className="text-gray-400">→</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Danger Zone */}
                <section>
                    <h2 className="text-lg font-medium mb-4 text-red-600 border-b border-red-200 pb-2">
                        Danger Zone
                    </h2>
                    <div className="border border-red-200 rounded-md p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-gray-500">
                                    Sign out of your account on this device
                                </p>
                            </div>
                            <SignOutButton>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                    Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
