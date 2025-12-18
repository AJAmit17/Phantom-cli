"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DeviceAuthorizationPage() {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (err) {
      setError("Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 8);
    }
    setUserCode(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50">
            <ShieldAlert className="w-12 h-12 text-yellow-400" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Device Authorization
            </h1>
            <p className="text-gray-400 text-lg">Enter your device code to continue</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-2 border-gray-700/50 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Authorize Device</CardTitle>
            <CardDescription>
              Find this code on the device you want to authorize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Input */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                  Device Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={userCode}
                  onChange={handleCodeChange}
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  className="h-14 text-center text-2xl font-mono tracking-widest bg-gray-800 border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || userCode.length < 9}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Verifying..." : "Continue"}
              </Button>

              {/* Info Box */}
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <p className="text-xs text-gray-400 leading-relaxed">
                  ⚠️ This code is unique to your device and will expire shortly. Keep it confidential
                  and never share it with anyone.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
