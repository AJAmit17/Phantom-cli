import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignOutButton from "@/components/sign-out-button";
import { ApiKeyManager } from "@/components/api-key-manager";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Terminal, User, Clock, Sparkles } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Welcome Card */}
                    <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">
                                Welcome back, {session.user.name || "User"}!
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                You are successfully authenticated and ready to use all features
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/chat">
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-blue-500/50 transition-all cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50">
                                            <MessageSquare className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <CardTitle className="text-white">AI Chat</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-400">
                                        Start a conversation with Gemini AI
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                                        Open Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/device">
                            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-yellow-500/50 transition-all cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50">
                                            <Terminal className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <CardTitle className="text-white">Device Authorization</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-400">
                                        Authorize a new device using a code
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                                        Enter Code
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Account Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50">
                                        <User className="w-5 h-5 text-green-400" />
                                    </div>
                                    <CardTitle className="text-white">Account Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Name</p>
                                    <p className="font-medium text-white">
                                        {session.user.name || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-white">{session.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">User ID</p>
                                    <p className="font-mono text-sm text-gray-400 break-all">
                                        {session.user.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50">
                                        <Clock className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <CardTitle className="text-white">Session Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Session ID</p>
                                    <p className="font-mono text-sm text-gray-400 break-all">
                                        {session.session.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Expires At</p>
                                    <p className="font-medium text-white">
                                        {new Date(session.session.expiresAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 border border-green-700 text-green-400">
                                        Active
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features Card */}
                    <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Available Features</CardTitle>
                            <CardDescription className="text-gray-400">
                                Explore the capabilities of Orbital CLI
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                    <h3 className="font-semibold text-white mb-2">AI Chat</h3>
                                    <p className="text-sm text-gray-400">
                                        Engage in natural conversations powered by Google Gemini
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                    <h3 className="font-semibold text-white mb-2">Device Flow</h3>
                                    <p className="text-sm text-gray-400">
                                        Securely authorize devices using OAuth device flow
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                    <h3 className="font-semibold text-white mb-2">Secure Auth</h3>
                                    <p className="text-sm text-gray-400">
                                        Enterprise-grade authentication with Better Auth
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Key Management */}
                    <ApiKeyManager />
                </div>
            </div>
        </div>
    );
}
