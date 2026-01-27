import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function setRole(userId: string, role: string) {
    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role,
            },
        });
        console.log(`Successfully set role "${role}" for user ${userId}`);
    } catch (error) {
        console.error("Error setting role:", error);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: npx ts-node scripts/set-clerk-role.ts <userId> <role>");
    process.exit(1);
}

setRole(args[0], args[1]);
