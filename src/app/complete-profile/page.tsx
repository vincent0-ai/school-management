import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import CompleteProfileForm from "@/components/forms/CompleteProfileForm";
import { redirect } from "next/navigation";

const CompleteProfilePage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = user.publicMetadata.role as string;

    // Fetch related data for selection
    const grades = await prisma.grade.findMany();
    const classes = await prisma.class.findMany({
        include: { _count: { select: { students: true } } }
    });
    const parents = await prisma.parent.findMany();
    const subjects = await prisma.subject.findMany();

    return (
        <div className="min-h-screen bg-lamaSkyLight flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <CompleteProfileForm
                    user={JSON.parse(JSON.stringify(user))}
                    relatedData={{ grades, classes, parents, subjects }}
                />
            </div>
        </div>
    );
};

export default CompleteProfilePage;
