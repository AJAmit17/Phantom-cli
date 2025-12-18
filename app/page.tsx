import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Zap, MessageSquare, Terminal, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50">
                <Sparkles className="w-16 h-16 text-blue-400" />
              </div>
            </div>
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to Orbital CLI
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A powerful monolithic application with AI chat, device authorization, and secure authentication
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/sign-in">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8 h-12">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 text-white text-lg px-8 h-12">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-blue-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 w-fit mb-2">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">AI-Powered Chat</CardTitle>
                <CardDescription className="text-gray-400">
                  Chat with Gemini AI for intelligent conversations and assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Natural language processing</li>
                  <li>✓ Conversation history</li>
                  <li>✓ Markdown formatting</li>
                  <li>✓ Real-time responses</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-green-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 w-fit mb-2">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Secure Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Enterprise-grade security with Better Auth and device flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ GitHub OAuth integration</li>
                  <li>✓ Device authorization flow</li>
                  <li>✓ Session management</li>
                  <li>✓ Secure token storage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 w-fit mb-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Modern Stack</CardTitle>
                <CardDescription className="text-gray-400">
                  Built with cutting-edge technologies for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Next.js 16 with App Router</li>
                  <li>✓ Prisma ORM</li>
                  <li>✓ PostgreSQL database</li>
                  <li>✓ TypeScript throughout</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-yellow-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 w-fit mb-2">
                  <Terminal className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">CLI Integration</CardTitle>
                <CardDescription className="text-gray-400">
                  Command-line interface for device authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Device code flow</li>
                  <li>✓ Token management</li>
                  <li>✓ Session verification</li>
                  <li>✓ Easy authorization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 w-fit mb-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">AI Services</CardTitle>
                <CardDescription className="text-gray-400">
                  Multiple AI modes for different use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Chat mode</li>
                  <li>✓ Tool calling support</li>
                  <li>✓ Agent workflows</li>
                  <li>✓ Streaming responses</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl hover:border-pink-500/50 transition-all">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/50 w-fit mb-2">
                  <Github className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-white">Open Source Ready</CardTitle>
                <CardDescription className="text-gray-400">
                  Clean architecture and modular design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Monolithic architecture</li>
                  <li>✓ Service layer pattern</li>
                  <li>✓ Type-safe APIs</li>
                  <li>✓ Easy to extend</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                Sign up now and experience the power of AI-driven conversations with secure device authorization
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8 h-12">
                    Create Account
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 text-white text-lg px-8 h-12">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Built with Next.js, Better Auth, Prisma, and Google AI</p>
            <p className="mt-2">© 2024 Orbital CLI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
