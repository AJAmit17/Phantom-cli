"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";

export default function SignInPage() {
    const handleGitHubSignIn = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Sign in with your GitHub account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleGitHubSignIn}
                        className="w-full"
                        size="lg"
                    >
                        <Github className="mr-2 h-5 w-5" />
                        Continue with GitHub
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                        By continuing, you agree to our Terms of Service and Privacy
                        Policy
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
