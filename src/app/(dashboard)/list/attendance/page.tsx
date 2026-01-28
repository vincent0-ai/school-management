import { auth } from "@clerk/nextjs/server";

const AttendanceListPage = async () => {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role || "";

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Attendance</h1>
            </div>
            <div className="mt-4 text-gray-500">
                Attendance tracking feature is coming soon.
            </div>
        </div>
    );
};

export default AttendanceListPage;
