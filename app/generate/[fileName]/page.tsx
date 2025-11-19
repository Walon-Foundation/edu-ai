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
  Layers,
  HelpCircle,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Demo data for testing
const demoContent = {
  summary: `# Introduction to Machine Learning - Summary

## Core Concepts
Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed. It focuses on developing algorithms that can identify patterns in data and make predictions or decisions based on that data.

## Main Approaches
- **Supervised Learning**: Algorithms learn from labeled training data (e.g., classification, regression)
- **Unsupervised Learning**: Algorithms find patterns in unlabeled data (e.g., clustering, dimensionality reduction)
- **Reinforcement Learning**: Algorithms learn through trial and error using rewards and punishments

## Key Applications
- Image and speech recognition
- Natural language processing
- Recommendation systems
- Fraud detection
- Autonomous vehicles

## Importance
Machine learning is transforming industries by enabling data-driven decision making, automating complex tasks, and uncovering insights from large datasets that would be impossible for humans to analyze manually.`,

  flashcards: `Q: What is machine learning?
A: A subset of AI that enables computers to learn from data without explicit programming.

Q: What are the three main types of machine learning?
A: Supervised learning, unsupervised learning, and reinforcement learning.

Q: What is supervised learning?
A: Learning from labeled training data to make predictions or decisions.

Q: What is unsupervised learning?
A: Finding patterns and relationships in unlabeled data.

Q: What is reinforcement learning?
A: Learning through trial and error using a system of rewards and punishments.

Q: What is a common application of machine learning?
A: Image recognition, recommendation systems, or fraud detection.

Q: What is the difference between AI and machine learning?
A: AI is the broader concept, while machine learning is a specific approach to achieving AI.

Q: What is training data?
A: The dataset used to teach a machine learning model.

Q: What is a neural network?
A: A computing system inspired by the human brain that can learn patterns.

Q: What is overfitting?
A: When a model learns the training data too well and performs poorly on new data.`,

  qa: `Q: What is the main goal of machine learning?
A: To enable computers to learn from data and make predictions or decisions without being explicitly programmed for each task.

Q: How does supervised learning work?
A: It uses labeled training data where each example is paired with the correct output, allowing the algorithm to learn the mapping between inputs and outputs.

Q: What are some common unsupervised learning techniques?
A: Clustering (grouping similar data points) and dimensionality reduction (simplifying data while preserving its structure).

Q: Why is reinforcement learning different from other approaches?
A: It doesn't use labeled data but instead learns through interaction with an environment and receiving rewards or penalties for actions.

Q: What is the role of training data in machine learning?
A: Training data is used to teach the algorithm patterns and relationships, allowing it to make accurate predictions on new, unseen data.

Q: How does machine learning handle large datasets?
A: Through algorithms that can efficiently process and find patterns in massive amounts of data that would be impractical for humans to analyze.

Q: What is the importance of feature selection?
A: Choosing the right features (input variables) significantly impacts model performance and helps avoid overfitting.

Q: How do recommendation systems use machine learning?
A: They analyze user behavior and preferences to suggest relevant products, content, or services.

Q: What is deep learning?
A: A subset of machine learning that uses neural networks with multiple layers to learn complex patterns in data.

Q: Why is model evaluation important?
A: It ensures the model performs well on new data and helps identify issues like overfitting or bias.`
};

export default function GeneratePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const fileName = decodeURIComponent(params.fileName as string);
  const fileId = searchParams.get('fileId');
  const action = searchParams.get('action') as 'summary' | 'flashcards' | 'qa' | null;
  
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [useDemoData, setUseDemoData] = useState(false);

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

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, sometimes simulate API failure
      const shouldFail = Math.random() < 0.1; // 10% chance of failure
      
      if (shouldFail && !useDemoData) {
        throw new Error('API service temporarily unavailable. Please try again.');
      }

      // Use demo data if API fails or if demo mode is enabled
      if (useDemoData || shouldFail) {
        setGeneratedContent(demoContent[action as keyof typeof demoContent] || demoContent.summary);
        setUseDemoData(true);
      } else {
        // In a real app, this would be your actual API call
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId,
            action
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Generation failed');
        }

        const result = await response.json();
        setGeneratedContent(result.content);
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
      // If API fails, fall back to demo data
      if (action && demoContent[action as keyof typeof demoContent]) {
        setGeneratedContent(demoContent[action as keyof typeof demoContent]);
        setUseDemoData(true);
      } else {
        setError(error instanceof Error ? error.message : 'Failed to generate content');
      }
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
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.pdf', '')}-${action}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = (newAction: 'summary' | 'flashcards' | 'qa') => {
    // Update URL with new action and trigger regeneration
    const newUrl = `/generate/${encodeURIComponent(fileName)}?fileId=${fileId}&action=${newAction}`;
    router.push(newUrl);
  };

  const getActionDisplayName = () => {
    const names = {
      summary: 'Summary',
      flashcards: 'Flashcards', 
      qa: 'Questions & Answers'
    };
    return names[action as keyof typeof names] || 'Content';
  };

  const getActionIcon = () => {
    const icons = {
      summary: BookOpen,
      flashcards: Layers,
      qa: HelpCircle
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
            <p className="text-gray-600 mb-4">AI is creating your study materials from "{fileName}"</p>
            <Progress value={45} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds...</p>
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
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button onClick={generateContent}>
                Try Again
              </Button>
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
                  {useDemoData && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      Demo Data
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                className="gap-2"
                disabled={copied}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Demo Data Notice */}
      {useDemoData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Showing demo content. In a real application, this would be AI-generated from your PDF.
            </AlertDescription>
          </Alert>
        </div>
      )}

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
                  onClick={() => handleRegenerate('summary')}
                  variant={action === 'summary' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Summary
                </Button>
                
                <Button
                  onClick={() => handleRegenerate('flashcards')}
                  variant={action === 'flashcards' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                >
                  <Layers className="h-4 w-4" />
                  Flashcards
                </Button>
                
                <Button
                  onClick={() => handleRegenerate('qa')}
                  variant={action === 'qa' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Q&A
                </Button>

                {/* Demo Mode Toggle */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Demo Mode</span>
                    <Button
                      variant={useDemoData ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseDemoData(!useDemoData)}
                    >
                      {useDemoData ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
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
                  {useDemoData && (
                    <div className="text-amber-600 text-xs">
                      Using demo machine learning content
                    </div>
                  )}
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
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-900 bg-gray-50 p-6 rounded-lg">
                        {generatedContent}
                      </pre>
                    </div>
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