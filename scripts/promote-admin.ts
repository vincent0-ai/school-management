import { createClerkClient } from '@clerk/backend';
import fs from 'fs';
import path from 'path';

// Simple .env parser to avoid adding dotenv dependency
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log('Loading .env file...');
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach((line) => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn('.env file not found');
    }
}

loadEnv();

const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
    console.error("CLERK_SECRET_KEY not found in .env");
    process.exit(1);
}

const clerkClient = createClerkClient({ secretKey });

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email address as an argument.");
        console.error("Usage: npx ts-node scripts/promote-admin.ts <email>");
        process.exit(1);
    }

    try {
        console.log(`Looking up user with email: ${email}`);
        const userList = await clerkClient.users.getUserList({
            emailAddress: [email],
        });

        if (userList.totalCount === 0) {
            console.error(`No user found with email: ${email}`);
            console.log(`Please ensuring the user '${email}' has signed up in the application.`);
            process.exit(1);
        }

        const user = userList.data[0];
        console.log(`Found user: ${user.id} (${user.emailAddresses[0].emailAddress})`);

        console.log('Promoting to admin...');
        await clerkClient.users.updateUser(user.id, {
            publicMetadata: {
                role: 'admin',
                approved: true,
            },
        });

        console.log(`Successfully promoted ${email} to admin.`);
    } catch (error) {
        console.error("Error promoting user:", error);
        process.exit(1);
    }
}

main();
