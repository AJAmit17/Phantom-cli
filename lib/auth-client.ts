import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NETXT_PUBLIC_BETTER_AUTH_URL || "https://phantom-agent-cli.vercel.app",
});

export const { 
    signIn, 
    signUp, 
    signOut, 
    useSession 
} = authClient;
