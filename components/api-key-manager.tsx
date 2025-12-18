"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Form state
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [modelId, setModelId] = useState("gemini-1.5-flash");

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      toast.error("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!name || !key) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, key, provider: "google", modelId }),
      });

      if (response.ok) {
        toast.success("API key added successfully");
        setOpen(false);
        setName("");
        setKey("");
        setModelId("gemini-1.5-flash");
        fetchApiKeys();
      } else {
        toast.error("Failed to add API key");
      }
    } catch (error) {
      toast.error("Failed to add API key");
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("API key deleted successfully");
        fetchApiKeys();
      } else {
        toast.error("Failed to delete API key");
      }
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(`API key ${!isActive ? "activated" : "deactivated"}`);
        fetchApiKeys();
      } else {
        toast.error("Failed to update API key");
      }
    } catch (error) {
      toast.error("Failed to update API key");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage your API keys (bring your own key)
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add API Key</DialogTitle>
                <DialogDescription>
                  Add your own API key to use with the AI chat
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="My API Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelId">Model</Label>
                  <Select value={modelId} onValueChange={setModelId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</SelectItem>
                      <SelectItem value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B (Fastest)</SelectItem>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Best)</SelectItem>
                      <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Latest)</SelectItem>
                      <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                      <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the model to use with your API key
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Google AI API Key</Label>
                  <Input
                    id="key"
                    type="password"
                    placeholder="AIza..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your key at{" "}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddKey}>Add Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <KeyRound className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No API keys configured</p>
            <p className="text-sm">Add your own API key to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <Badge
                      variant={apiKey.isActive ? "default" : "secondary"}
                    >
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Model: {apiKey.modelId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(apiKey.id, apiKey.isActive)
                    }
                  >
                    {apiKey.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
