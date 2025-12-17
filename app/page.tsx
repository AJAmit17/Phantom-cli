import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to Better Auth
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete authentication system built with Better Auth and Next.js
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Secure Authentication</CardTitle>
                <CardDescription>
                  Email and password authentication with secure session management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Encrypted password storage</li>
                  <li>✓ Session-based authentication</li>
                  <li>✓ Protected routes</li>
                  <li>✓ Automatic session refresh</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Modern Stack</CardTitle>
                <CardDescription>
                  Built with the latest web technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Next.js 16 with App Router</li>
                  <li>✓ Better Auth integration</li>
                  <li>✓ Prisma ORM with PostgreSQL</li>
                  <li>✓ TypeScript support</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create an account or sign in to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="font-semibold">
                  Create Account
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="font-semibold">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Create Your Account</h3>
                  <p className="text-sm text-gray-600">
                    Sign up with your email and a secure password
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Access Protected Content</h3>
                  <p className="text-sm text-gray-600">
                    Navigate to the dashboard and view your profile information
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Build Your App</h3>
                  <p className="text-sm text-gray-600">
                    Use this authentication system as a foundation for your application
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
