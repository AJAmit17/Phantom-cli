import { createAuthClient } from "better-auth/react";
import { deviceAuthorizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: "https://phantom-agent-cli.vercel.app",
    plugins: [
        deviceAuthorizationClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession
} = authClient;
