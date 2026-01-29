const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const userId = process.argv[2];

    if (!userId) {
        console.log('Usage: node scripts/fix-admin.js YOUR_CLERK_USER_ID');
        return;
    }

    console.log('Adding admin record for user:', userId);

    // Check if already exists
    const existing = await prisma.admin.findUnique({ where: { id: userId } });
    if (existing) {
        console.log('Admin record already exists!');
        return;
    }

    // Create admin record with unique username based on user ID
    const uniqueUsername = 'admin_' + userId.slice(-8);

    await prisma.admin.create({
        data: {
            id: userId,
            username: uniqueUsername
        }
    });

    console.log('✅ Admin record created successfully with username:', uniqueUsername);
    console.log('');
    console.log('Now update Clerk metadata for this user to:');
    console.log('{ "role": "admin", "approved": true }');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
