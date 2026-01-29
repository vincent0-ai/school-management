import { getCurrentUserRole } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const ProfilePage = async () => {
    const { role, userId } = await getCurrentUserRole();
    const clerkUser = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    // Fetch user data based on role
    let userData: any = null;
    let className = "";
    let subjects: string[] = [];

    if (role === "student") {
        userData = await prisma.student.findUnique({
            where: { id: userId },
            include: {
                class: true,
                grade: true,
                parent: true,
            },
        });
        if (userData) {
            className = userData.class?.name || "";
        }
    } else if (role === "teacher") {
        userData = await prisma.teacher.findUnique({
            where: { id: userId },
            include: {
                subjects: true,
                classes: true,
            },
        });
        if (userData) {
            subjects = userData.subjects?.map((s: any) => s.name) || [];
        }
    } else if (role === "parent") {
        userData = await prisma.parent.findUnique({
            where: { id: userId },
            include: {
                students: {
                    include: {
                        class: true,
                    },
                },
            },
        });
    } else if (role === "admin") {
        userData = await prisma.admin.findUnique({
            where: { id: userId },
        });
    }

    // If user exists in Clerk but not in DB yet
    const isProfileComplete = userData !== null;

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT - MAIN PROFILE */}
            <div className="w-full xl:w-2/3">
                <div className="bg-white rounded-md p-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-semibold">My Profile</h1>
                        {isProfileComplete && role !== "admin" && (
                            <FormContainer
                                table={role as "student" | "teacher" | "parent"}
                                type="update"
                                data={userData}
                            />
                        )}
                    </div>

                    {!isProfileComplete ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">
                                Your profile is not complete yet.
                            </p>
                            <Link
                                href="/complete-profile"
                                className="bg-lamaPurple text-white px-6 py-2 rounded-md hover:bg-lamaPurpleLight"
                            >
                                Complete Profile
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* USER INFO CARD */}
                            <div className="bg-lamaSky py-6 px-4 rounded-md flex flex-col md:flex-row gap-4">
                                <div className="flex justify-center md:w-1/4">
                                    <Image
                                        src={userData?.img || clerkUser?.imageUrl || "/noAvatar.png"}
                                        alt="Profile"
                                        width={144}
                                        height={144}
                                        className="w-36 h-36 rounded-full object-cover"
                                    />
                                </div>
                                <div className="md:w-3/4 flex flex-col justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {userData?.name} {userData?.surname}
                                        </h2>
                                        <p className="text-gray-600 capitalize">{role}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Image src="/mail.png" alt="" width={16} height={16} />
                                            <span>{userData?.email || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Image src="/phone.png" alt="" width={16} height={16} />
                                            <span>{userData?.phone || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Image src="/date.png" alt="" width={16} height={16} />
                                            <span>
                                                {userData?.birthday
                                                    ? new Intl.DateTimeFormat("en-GB").format(userData.birthday)
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Image src="/home.png" alt="" width={16} height={16} />
                                            <span>{userData?.address || "-"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROLE-SPECIFIC INFO */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {role === "student" && (
                                    <>
                                        <div className="bg-lamaYellowLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Course</h3>
                                            <p className="text-lg font-semibold">{className || "-"}</p>
                                        </div>
                                        <div className="bg-lamaSkyLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Year of Study</h3>
                                            <p className="text-lg font-semibold">
                                                Year {userData?.grade?.level || "-"}
                                            </p>
                                        </div>
                                        <div className="bg-lamaPurpleLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Username</h3>
                                            <p className="text-lg font-semibold">{userData?.username}</p>
                                        </div>
                                    </>
                                )}

                                {role === "teacher" && (
                                    <>
                                        <div className="bg-lamaYellowLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Units Teaching</h3>
                                            <p className="text-lg font-semibold">
                                                {subjects.length > 0 ? subjects.join(", ") : "-"}
                                            </p>
                                        </div>
                                        <div className="bg-lamaSkyLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Courses Supervising</h3>
                                            <p className="text-lg font-semibold">
                                                {userData?.classes?.length || 0}
                                            </p>
                                        </div>
                                        <div className="bg-lamaPurpleLight p-4 rounded-md">
                                            <h3 className="text-gray-500 text-sm">Username</h3>
                                            <p className="text-lg font-semibold">{userData?.username}</p>
                                        </div>
                                    </>
                                )}

                                {role === "parent" && (
                                    <>
                                        <div className="bg-lamaYellowLight p-4 rounded-md col-span-full">
                                            <h3 className="text-gray-500 text-sm mb-2">Children</h3>
                                            {userData?.students?.map((student: any) => (
                                                <div key={student.id} className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{student.name} {student.surname}</span>
                                                    <span className="text-sm text-gray-500">({student.class?.name})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {role === "admin" && (
                                    <div className="bg-lamaPurpleLight p-4 rounded-md">
                                        <h3 className="text-gray-500 text-sm">Username</h3>
                                        <p className="text-lg font-semibold">{userData?.username}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT - QUICK ACTIONS */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-col gap-2">
                        {role === "student" && isProfileComplete && (
                            <>
                                <Link
                                    href={`/list/lessons?classId=${userData?.classId}`}
                                    className="p-3 rounded-md bg-lamaSkyLight hover:bg-lamaSky transition-colors"
                                >
                                    📚 My Lessons
                                </Link>
                                <Link
                                    href={`/list/exams?classId=${userData?.classId}`}
                                    className="p-3 rounded-md bg-lamaYellowLight hover:bg-lamaYellow transition-colors"
                                >
                                    📝 My Exams
                                </Link>
                                <Link
                                    href={`/list/results?studentId=${userId}`}
                                    className="p-3 rounded-md bg-lamaPurpleLight hover:bg-lamaPurple transition-colors"
                                >
                                    📊 My Results
                                </Link>
                            </>
                        )}
                        {role === "teacher" && isProfileComplete && (
                            <>
                                <Link
                                    href={`/list/lessons?teacherId=${userId}`}
                                    className="p-3 rounded-md bg-lamaSkyLight hover:bg-lamaSky transition-colors"
                                >
                                    📚 My Lessons
                                </Link>
                                <Link
                                    href="/list/students"
                                    className="p-3 rounded-md bg-lamaYellowLight hover:bg-lamaYellow transition-colors"
                                >
                                    👥 My Students
                                </Link>
                                <Link
                                    href="/list/exams"
                                    className="p-3 rounded-md bg-lamaPurpleLight hover:bg-lamaPurple transition-colors"
                                >
                                    📝 Manage Exams
                                </Link>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <Link
                                    href="/list/teachers"
                                    className="p-3 rounded-md bg-lamaSkyLight hover:bg-lamaSky transition-colors"
                                >
                                    👨‍🏫 Manage Lecturers
                                </Link>
                                <Link
                                    href="/list/students"
                                    className="p-3 rounded-md bg-lamaYellowLight hover:bg-lamaYellow transition-colors"
                                >
                                    👨‍🎓 Manage Students
                                </Link>
                                <Link
                                    href="/list/approvals"
                                    className="p-3 rounded-md bg-lamaPurpleLight hover:bg-lamaPurple transition-colors"
                                >
                                    ✅ Pending Approvals
                                </Link>
                            </>
                        )}
                        <Link
                            href="/settings"
                            className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            ⚙️ Settings
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Account Info</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Clerk ID</span>
                            <span className="font-mono text-xs">{userId?.slice(0, 15)}...</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Role</span>
                            <span className="capitalize font-medium">{role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
