"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface SendMessageParams {
  message: string;
  conversationId: string | null;
}

interface ChatResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  toolCalls?: any[];
  toolResults?: any[];
}

const sendMessage = async (params: SendMessageParams): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export default function ChatPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onMutate: async (variables) => {
      // Optimistically add user message
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: variables.message,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);
      return { tempUserMessage };
    },
    onSuccess: (data, variables, context) => {
      // Update conversation ID if it's a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Replace temp message with real messages
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== context?.tempUserMessage.id),
        data.userMessage,
        data.assistantMessage,
      ]);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to send message");
      // Remove the temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== context?.tempUserMessage.id));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    sendMessageMutation.mutate({ message: userMessage, conversationId });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Chat</h1>
              <p className="text-sm text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-gray-700 hover:bg-gray-800"
          >
            Dashboard
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50 mb-6">
                <Sparkles className="w-16 h-16 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Start a conversation</h2>
              <p className="text-gray-400 text-center max-w-md">
                Ask me anything! I'm here to help with your questions, ideas, or just to chat.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-10 h-10 border-2 border-blue-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 text-white"
                      : "bg-gray-800/50 border-gray-700/50 text-gray-100"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      className="prose prose-invert prose-sm max-w-none"
                      components={{
                        code: ({ node, ...props }) => (
                          <code className="bg-gray-900 px-1 py-0.5 rounded text-sm" {...props} />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </Card>
                {message.role === "user" && (
                  <Avatar className="w-10 h-10 border-2 border-blue-500/50">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      {session?.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {sendMessageMutation.isPending && (
            <div className="flex gap-4 justify-start">
              <Avatar className="w-10 h-10 border-2 border-blue-500/50">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  AI
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-gray-800/50 border-gray-700/50">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="min-h-[60px] max-h-[200px] bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder:text-gray-500"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!input.trim() || sendMessageMutation.isPending}
              className="h-[60px] px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
