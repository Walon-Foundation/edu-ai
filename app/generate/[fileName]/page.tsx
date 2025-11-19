// app/generate/[fileName]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Download,
  Copy,
  BookOpen,
  HelpCircle,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GeneratePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fileName = decodeURIComponent(params.fileName as string);
  const fileId = searchParams.get("fileId");
  const action = searchParams.get("action") as "summary" | "qa" | null;

  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (fileId && action) {
      generateContent();
    } else {
      setError("Missing file ID or action type");
      setLoading(false);
    }
  }, [fileId, action]);

  const generateContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setGeneratedContent("");

      // Determine the correct API endpoint based on action
      let apiEndpoint = "";
      if (action === "summary") {
        apiEndpoint = `/api/generate/${fileId}/summaries`;
      } else if (action === "qa") {
        apiEndpoint = `/api/generate/${fileId}/question-and-answer`;
      } else {
        throw new Error("Invalid action type");
      }

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const result = await response.json();
      setGeneratedContent(result.content || result.data || "");
    } catch (error) {
      console.error("Error generating content:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate content",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(".pdf", "")}-${action}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = (newAction: "summary" | "qa") => {
    // Update URL with new action and trigger regeneration
    const newUrl = `/generate/${encodeURIComponent(fileName)}?fileId=${fileId}&action=${newAction}`;
    router.push(newUrl);
  };

  const getActionDisplayName = () => {
    const names = {
      summary: "Summary",
      qa: "Questions & Answers",
    };
    return names[action as keyof typeof names] || "Content";
  };

  const getActionIcon = () => {
    const icons = {
      summary: BookOpen,
      qa: HelpCircle,
    };
    return icons[action as keyof typeof icons] || FileText;
  };

  const ActionIcon = getActionIcon();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <Sparkles className="h-6 w-6 text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Generating {getActionDisplayName()}
            </h2>
            <p className="text-gray-600 mb-4">
              AI is creating your study materials from "{fileName}"
            </p>
            <Progress value={45} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              This may take a few seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generation Failed
            </h3>
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
              <Button onClick={generateContent}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      {/* <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Files
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {fileName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <ActionIcon className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <Badge variant="secondary" className="capitalize">
                    {getActionDisplayName()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                className="gap-2"
                disabled={copied || !generatedContent}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button 
                onClick={handleDownload} 
                className="gap-2"
                disabled={!generatedContent}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Regeneration Options */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleRegenerate("summary")}
                  variant={action === "summary" ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  disabled={loading}
                >
                  <BookOpen className="h-4 w-4" />
                  Summary
                </Button>

                <Button
                  onClick={() => handleRegenerate("qa")}
                  variant={action === "qa" ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  disabled={loading}
                >
                  <HelpCircle className="h-4 w-4" />
                  Q&A
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">File: {fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span>AI Generated Content</span>
                  </div>
                  <div>
                    <span>Created: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0">
                <ScrollArea className="h-[75vh]">
                  <div className="p-6">
                    {generatedContent ? (
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-900 bg-gray-50 p-6 rounded-lg">
                          {generatedContent}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Content Generated
                        </h3>
                        <p className="text-gray-600 mb-4">
                          The generation process completed but no content was
                          returned.
                        </p>
                        <Button onClick={generateContent}>Try Again</Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
