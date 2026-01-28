const { createClerkClient } = require("@clerk/clerk-sdk-node");

const secretKey = "sk_test_iVOkU2H3WVkTpy70pyGH7ok7HqzjaTaavmeomMj6HY";
const clerk = createClerkClient({ secretKey });

async function listUsers() {
    try {
        const response = await clerk.users.getUserList();
        console.log("Total Users:", response.data.length);
        response.data.forEach(u => {
            console.log(`User: ${u.username || u.id}`);
            console.log(`  Email: ${u.emailAddresses[0]?.emailAddress}`);
            console.log(`  Public:`, JSON.stringify(u.publicMetadata));
            console.log(`  Unsafe:`, JSON.stringify(u.unsafeMetadata));
            console.log("---");
        });
    } catch (err) {
        console.error("Error listing users:", err);
    }
}

listUsers();
