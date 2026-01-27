import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const PendingPage = () => {
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
                <h2 className="text-xl font-semibold text-gray-800">Account Pending Approval</h2>
                <p className="text-gray-500">
                    Thank you for signing up! Your account is currently being reviewed by our administrators.
                    You will be able to access the dashboard once your account is approved.
                </p>
                <p className="text-sm text-gray-400 italic">
                    Please check back later.
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
            </div>
        </div>
    );
};

export default PendingPage;
