import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { deviceAuthorization, bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    plugins: [
        nextCookies(),
        bearer(),
        deviceAuthorization({
            expiresIn: "30m", // Device code expiration time
            interval: "5s", // Minimum polling interval
        }),
    ],
    logger: {
        level: "debug"
    }
});

export type Session = typeof auth.$Infer.Session;
