import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function listUsers() {
    try {
        const users = await clerkClient.users.getUserList();
        console.log(JSON.stringify(users.data.map(u => ({
            id: u.id,
            username: u.username,
            email: u.emailAddresses[0]?.emailAddress,
            publicMetadata: u.publicMetadata,
            unsafeMetadata: u.unsafeMetadata
        })), null, 2));
    } catch (err) {
        console.error(err);
    }
}

listUsers();
