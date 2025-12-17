import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignOutButton from "@/components/sign-out-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <SignOutButton />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back!</CardTitle>
                        <CardDescription>You are successfully authenticated</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{session.user.name || "Not provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{session.user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">User ID</p>
                            <p className="font-mono text-sm">{session.user.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Session Expires</p>
                            <p className="font-medium">
                                {new Date(session.session.expiresAt).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Protected Content</CardTitle>
                        <CardDescription>
                            This page is protected and only accessible to authenticated users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">
                            You can now build your application features here. The authentication
                            system is fully set up and working!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
