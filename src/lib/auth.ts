import { auth, clerkClient } from "@clerk/nextjs/server";

export type UserRole = "admin" | "teacher" | "student" | "parent" | "";

export interface UserMetadata {
    role: UserRole;
    approved?: boolean;
    userId: string | null;
}

/**
 * Get the current user's role and metadata.
 * This function handles the fallback to clerkClient if sessionClaims are not available.
 */
export async function getCurrentUserRole(): Promise<UserMetadata> {
    const { userId, sessionClaims } = await auth();

    let publicMetadata = sessionClaims?.metadata as { role?: string; approved?: boolean } | undefined;

    // If sessionClaims doesn't have metadata, fetch it from the user object (fallback)
    if (userId && (!publicMetadata || !publicMetadata.role)) {
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            publicMetadata = user.publicMetadata as { role?: string; approved?: boolean };
        } catch (err) {
            console.error("[getCurrentUserRole] Failed to fetch user metadata:", err);
        }
    }

    return {
        role: (publicMetadata?.role as UserRole) || "",
        approved: publicMetadata?.approved,
        userId,
    };
}
