"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { KeyRound, Plus, Trash2, Loader2 } from "lucide-react";
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

interface ApiKeysResponse {
  apiKeys: ApiKey[];
}

// API functions
const fetchApiKeys = async (): Promise<ApiKey[]> => {
  const response = await fetch("/api/api-keys");
  if (!response.ok) throw new Error("Failed to fetch API keys");
  const data: ApiKeysResponse = await response.json();
  return data.apiKeys;
};

const addApiKey = async (params: {
  name: string;
  key: string;
  modelId: string;
}) => {
  const response = await fetch("/api/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, provider: "google" }),
  });
  if (!response.ok) throw new Error("Failed to add API key");
  return response.json();
};

const deleteApiKey = async (id: string) => {
  const response = await fetch(`/api/api-keys/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete API key");
  return response.json();
};

const toggleApiKey = async (params: { id: string; isActive: boolean }) => {
  const response = await fetch(`/api/api-keys/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: !params.isActive }),
  });
  if (!response.ok) throw new Error("Failed to update API key");
  return response.json();
};

export function ApiKeyManager() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [modelId, setModelId] = useState("gemini-2.0-flash");

  // Queries
  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: fetchApiKeys,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key added successfully");
      setOpen(false);
      setName("");
      setKey("");
      setModelId("gemini-2.0-flash");
    },
    onError: () => {
      toast.error("Failed to add API key");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete API key");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleApiKey,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success(
        `API key ${!variables.isActive ? "activated" : "deactivated"}`
      );
    },
    onError: () => {
      toast.error("Failed to update API key");
    },
  });

  const handleAddKey = () => {
    if (!name || !key) {
      toast.error("Please fill in all fields");
      return;
    }
    addMutation.mutate({ name, key, modelId });
  };

  const handleDeleteKey = (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    deleteMutation.mutate(id);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading API Keys...
          </CardTitle>
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
                <Button 
                  onClick={handleAddKey}
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Add Key
                </Button>
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
                    disabled={toggleMutation.isPending}
                  >
                    {toggleMutation.isPending && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {apiKey.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteKey(apiKey.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
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
