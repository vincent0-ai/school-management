import { clerkClient } from "@clerk/nextjs/server";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    console.log("[API] /api/auto-approve POST HIT");

    try {
        const body = await req.json();
        const { userId, email } = body;

        console.log(`[API] Received request for: ${email} (ID: ${userId})`);

        if (!userId || !email) {
            return NextResponse.json({ message: "Missing userId or email" }, { status: 400 });
        }

        if (email.endsWith("@students.jkuat.ac.ke")) {
            console.log(`[AutoApprove] PROMOTING ${email} to student`);
            const client = await clerkClient()
            await client.users.updateUser(userId, {
                publicMetadata: {
                    role: "student",
                    approved: true,
                },
            });
            return NextResponse.json({ success: true });
        }

        console.log(`[AutoApprove] DENIED ${email} - does not match domain`);
        return NextResponse.json({ message: "Not eligible for auto-approval" }, { status: 400 });

    } catch (error) {
        console.error("Auto-approve error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
