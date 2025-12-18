"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle, XCircle, Smartphone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeviceApprovalContent() {
    const { data, isPending } = authClient.useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userCode = searchParams.get("user_code");
    const [isProcessing, setIsProcessing] = useState({
        approve: false,
        deny: false,
    });

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <Spinner />
            </div>
        );
    }

    if (!data?.session && !data?.user) {
        router.push("/sign-in");
        return null;
    }

    const handleApprove = async () => {
        setIsProcessing({ approve: true, deny: false });
        try {
            toast.loading("Approving device...", { id: "loading" });
            await authClient.device.approve({ userCode: userCode! });
            toast.dismiss("loading");
            toast.success("Device approved successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to approve device");
        }
        setIsProcessing({ approve: false, deny: false });
    };

    const handleDeny = async () => {
        setIsProcessing({ approve: false, deny: true });
        try {
            toast.loading("Denying device...", { id: "deny" });
            await authClient.device.deny({ userCode: userCode! });
            toast.dismiss("deny");
            toast.success("Device access denied!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to deny device");
        }
        setIsProcessing({ approve: false, deny: false });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-sans px-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header Card */}
                <Card className="border-2 border-gray-700/50 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
                                    <Smartphone className="w-12 h-12 text-cyan-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                    <span className="text-sm text-white font-bold">!</span>
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-white">
                            Device Authorization Request
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-base">
                            A new device is requesting access to your account
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Device Code Card */}
                <Card className="border-2 border-gray-700/50 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">
                            Authorization Code
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/30">
                            <p className="text-3xl font-mono font-bold text-cyan-400 text-center tracking-widest">
                                {userCode || "XXXX-XXXX"}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Verify this code matches the one shown on your device
                        </p>
                    </CardContent>
                </Card>

                {/* Security Info Card */}
                <Card className="border-2 border-gray-700/50 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-white mb-1">Signed in as:</p>
                                <p className="text-sm text-gray-400">{data?.user?.email}</p>
                            </div>
                        </div>
                        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                            <p className="text-sm text-yellow-200 leading-relaxed">
                                ⚠️ Only approve this request if you initiated it. For security, never share this
                                code with others.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={handleApprove}
                        disabled={isProcessing.approve || isProcessing.deny}
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isProcessing.approve ? (
                            <>
                                <Spinner className="w-5 h-5" />
                                <span>Approving...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Approve Device</span>
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleDeny}
                        disabled={isProcessing.approve || isProcessing.deny}
                        variant="outline"
                        className="w-full h-12 border-2 border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold text-lg rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing.deny ? (
                            <>
                                <Spinner className="w-5 h-5" />
                                <span>Denying...</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5" />
                                <span>Deny Device</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                    <span className="text-xs text-gray-600">Choose wisely</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                </div>
            </div>
        </div>
    );
}
