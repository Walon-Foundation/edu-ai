// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Trash2, 
  BookOpen, 
  HelpCircle,
  Layers,
  Plus,
  Sparkles,
  Calendar,
  BarChart3,
//   Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserFile {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  fileSize?: string;
  status?: "processed" | "processing" | "pending";
}

// Demo files data
const demoFiles: UserFile[] = [
  {
    id: "1",
    fileName: "Introduction to Machine Learning.pdf",
    fileUrl: "#",
    createdAt: "2024-01-15T10:30:00Z",
    fileSize: "2.4 MB",
    status: "processed"
  },
  {
    id: "2",
    fileName: "Advanced React Patterns.pdf",
    fileUrl: "#",
    createdAt: "2024-01-14T14:20:00Z",
    fileSize: "1.8 MB",
    status: "processed"
  },
  {
    id: "3",
    fileName: "Computer Networks Fundamentals.pdf",
    fileUrl: "#",
    createdAt: "2024-01-13T09:15:00Z",
    fileSize: "3.2 MB",
    status: "processing"
  },
  {
    id: "4",
    fileName: "Data Structures and Algorithms.pdf",
    fileUrl: "#",
    createdAt: "2024-01-12T16:45:00Z",
    fileSize: "4.1 MB",
    status: "processed"
  }
];

export default function Dashboard() {
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<{ fileId: string; action: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setUserFiles(demoFiles);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const fetchUserFiles = async () => {
    try {
      const response = await fetch("/api/upload", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserFiles(result.data || []);
      } else {
        console.error("Failed to fetch user files");
        // Fallback to demo files if API fails
        setUserFiles(demoFiles);
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
      // Fallback to demo files
      setUserFiles(demoFiles);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/delete-file?fileName=${encodeURIComponent(fileName)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove file from local state
        setUserFiles(prev => prev.filter(file => file.id !== fileId));
        console.log("File deleted successfully");
      } else {
        console.error("Failed to delete file");
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const handleGenerateContent = async (fileId: string, action: string) => {
    setSelectedAction({ fileId, action });
    
    // Simulate AI processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Navigate to results page or show modal with results
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} generated successfully!\n\nThis would show the AI-generated ${action} in a real application.`);
    } catch (error) {
      console.error(`Error generating ${action}:`, error);
      alert(`Error generating ${action}`);
    } finally {
      setSelectedAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: UserFile["status"]) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredFiles = userFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: userFiles.length,
    processed: userFiles.filter(f => f.status === "processed").length,
    processing: userFiles.filter(f => f.status === "processing").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your AI study materials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Your Study Documents
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your PDFs into smart study materials with AI-powered tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-purple-600">11.5 MB</p>
                </div>
                <Download className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 w-full sm:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="processed">Ready</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <Button onClick={() => window.location.href = '/upload'} className="gap-2">
                <Plus className="h-4 w-4" />
                Upload New
              </Button>
            </div>
          </CardContent>
        </Card>

        {filteredFiles.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-sm">
            <CardContent>
              <FileText className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {searchQuery || filterStatus !== "all" ? "No matching files" : "No files uploaded yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Upload your first PDF to get started with AI-powered study materials."
                }
              </p>
              <Button 
                onClick={() => window.location.href = '/upload'} 
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Upload Your First PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  Your Documents ({filteredFiles.length})
                </CardTitle>
                <CardDescription>
                  Click on any action button to generate AI-powered study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {filteredFiles.map((file) => (
                      <Card key={file.id} className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="relative">
                              <FileText className="h-12 w-12 text-red-500 flex-shrink-0" />
                              {file.status === "processing" && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="animate-ping h-3 w-3 bg-blue-500 rounded-full"></div>
                                  <div className="absolute top-0 right-0 h-3 w-3 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate text-lg">
                                  {file.fileName}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(file.status)}
                                  <Badge variant="secondary" className="bg-gray-100">
                                    {file.fileSize}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Uploaded {formatDate(file.createdAt)}</span>
                                </div>
                              </div>

                              {/* Processing Progress */}
                              {file.status === "processing" && (
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>AI Processing</span>
                                    <span>65%</span>
                                  </div>
                                  <Progress value={65} className="h-2" />
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                                <Button
                                  onClick={() => handleGenerateContent(file.id, 'summary')}
                                  disabled={selectedAction?.fileId === file.id && selectedAction?.action === 'summary' || file.status !== "processed"}
                                  variant="outline"
                                  className="gap-2 flex-1 sm:flex-none"
                                  size="sm"
                                >
                                  <BookOpen className="h-4 w-4" />
                                  {selectedAction?.fileId === file.id && selectedAction?.action === 'summary' ? (
                                    "Generating..."
                                  ) : (
                                    "Summaries"
                                  )}
                                </Button>

                                <Button
                                  onClick={() => handleGenerateContent(file.id, 'flashcards')}
                                  disabled={selectedAction?.fileId === file.id && selectedAction?.action === 'flashcards' || file.status !== "processed"}
                                  variant="outline"
                                  className="gap-2 flex-1 sm:flex-none"
                                  size="sm"
                                >
                                  <Layers className="h-4 w-4" />
                                  {selectedAction?.fileId === file.id && selectedAction?.action === 'flashcards' ? (
                                    "Generating..."
                                  ) : (
                                    "Flashcards"
                                  )}
                                </Button>

                                <Button
                                  onClick={() => handleGenerateContent(file.id, 'qa')}
                                  disabled={selectedAction?.fileId === file.id && selectedAction?.action === 'qa' || file.status !== "processed"}
                                  variant="outline"
                                  className="gap-2 flex-1 sm:flex-none"
                                  size="sm"
                                >
                                  <HelpCircle className="h-4 w-4" />
                                  {selectedAction?.fileId === file.id && selectedAction?.action === 'qa' ? (
                                    "Generating..."
                                  ) : (
                                    "Q&A"
                                  )}
                                </Button>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => window.open(file.fileUrl, '_blank')}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    disabled={file.status !== "processed"}
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="hidden sm:inline">Download</span>
                                  </Button>

                                  <Button
                                    onClick={() => handleDeleteFile(file.id, file.fileName)}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}