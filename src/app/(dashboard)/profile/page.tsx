import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
    const { sessionClaims } = await auth();
    const user = await currentUser();
    const role = (sessionClaims?.metadata as { role?: string })?.role || "";

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">User Profile</h1>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">Username</span>
                    <span className="font-medium">{user?.username || user?.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">Full Name</span>
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">Role</span>
                    <span className="font-medium uppercase">{role}</span>
                </div>
                <div className="mt-8 text-gray-500 italic">
                    Profile editing and detailed view are coming soon.
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
