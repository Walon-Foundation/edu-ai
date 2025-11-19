// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import {
  FileText,
  Trash2,
  BookOpen,
  HelpCircle,
  Layers,
  Plus,
  Sparkles,
  Calendar,
  BarChart3,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserFile {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  fileSize?: string;
}

export default function Dashboard() {
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<{
    fileId: string;
    action: string;
  } | null>(null);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set()); // Track files being deleted
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
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
        console.error("Failed to fetch files");
        setUserFiles([]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setUserFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      // Add file to deleting set to show loading state
      setDeletingFiles((prev) => new Set(prev).add(fileId));

      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserFiles((prev) => prev.filter((file) => file.id !== fileId));
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      toast.error("Error deleting file");
    } finally {
      // Remove file from deleting set
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleGenerateContent = async (
    fileId: string,
    fileName: string,
    action: string,
  ) => {
    setSelectedAction({ fileId, action });

    try {
      // Navigate immediately to the generate page with the action
      router.push(`/generate/${fileName}?action=${action}&fileId=${fileId}`);

      // The actual generation will happen on the generate page
    } catch (error) {
      console.error(`Error navigating to generate page:`, error);
      alert(`Error starting generation. Please try again.`);
    } finally {
      setSelectedAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (file: UserFile) => {
    // Since we removed status, all files are considered "ready"
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
        Ready
      </Badge>
    );
  };

  // Calculate total storage used from all files
  const calculateTotalStorage = () => {
    if (userFiles.length === 0) return "0 MB";

    const totalBytes = userFiles.reduce((total, file) => {
      if (!file.fileSize) return total;

      // Parse file size string (e.g., "2.4 MB", "1.8 MB")
      const sizeMatch = file.fileSize.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/i);
      if (!sizeMatch) return total;

      const sizeValue = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[2].toUpperCase();

      // Convert everything to bytes for calculation
      switch (unit) {
        case "B":
          return total + sizeValue;
        case "KB":
          return total + sizeValue * 1024;
        case "MB":
          return total + sizeValue * 1024 * 1024;
        case "GB":
          return total + sizeValue * 1024 * 1024 * 1024;
        default:
          return total;
      }
    }, 0);

    // Convert back to MB for display
    if (totalBytes === 0) return "0 MB";

    const totalMB = totalBytes / (1024 * 1024);
    return `${totalMB.toFixed(1)} MB`;
  };

  const filteredFiles = userFiles.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Since we removed status filter, only apply search filter
    return matchesSearch;
  });

  const stats = {
    total: userFiles.length,
    processed: userFiles.length, // All files are considered processed now
    processing: 0, // No processing files since status removed
    storageUsed: calculateTotalStorage(),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Your Study Documents
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Transform your PDFs into smart study materials with AI-powered tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Files
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Ready
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {stats.processed}
                  </p>
                </div>
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Processing
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {stats.processing}
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Storage Used
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {stats.storageUsed}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 text-sm sm:text-base"
                  />
                </div>

                {/* Remove status filter dropdown since status field is removed */}
              </div>

              <Button
                onClick={() => (window.location.href = "/upload")}
                className="gap-2 w-full sm:w-auto justify-center"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Upload New</span>
                <span className="xs:hidden">Upload</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {filteredFiles.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 border-0 shadow-sm">
            <CardContent className="px-4 sm:px-6">
              <FileText className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No matching files" : "No files uploaded yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Upload your first PDF to get started with AI-powered study materials."}
              </p>
              <Button
                onClick={() => (window.location.href = "/upload")}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Upload Your First PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  Your Documents ({filteredFiles.length})
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Click on any action button to generate AI-powered study
                  materials
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <ScrollArea className="h-[500px] sm:h-[600px]">
                  <div className="space-y-3 sm:space-y-4 pr-2">
                    {filteredFiles.map((file) => {
                      const isDeleting = deletingFiles.has(file.id);
                      return (
                        <Card
                          key={file.id}
                          className="p-3 sm:p-4 hover:shadow-md transition-all duration-200 border border-gray-100"
                        >
                          <div className="flex flex-col gap-3">
                            {/* File Header - Compact on mobile */}
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <FileText className="h-8 w-8 sm:h-10 sm:h-12 text-red-500" />
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* File Name - Proper truncation */}
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight break-words mb-1">
                                  {file.fileName}
                                </h3>

                                {/* Badges - Stack on mobile */}
                                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                                  {getStatusBadge(file)}
                                  {file.fileSize && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100 text-xs"
                                    >
                                      {file.fileSize}
                                    </Badge>
                                  )}
                                  {isDeleting && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-amber-100 text-amber-800 text-xs"
                                    >
                                      Deleting...
                                    </Badge>
                                  )}
                                </div>

                                {/* Upload Date */}
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    Uploaded {formatDate(file.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons - Improved mobile layout */}
                            <div className="flex flex-col gap-2">
                              {/* AI Action Buttons - Grid layout on mobile */}
                              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                                <Button
                                  onClick={() =>
                                    handleGenerateContent(
                                      file.id,
                                      file.fileName,
                                      "summary",
                                    )
                                  }
                                  disabled={
                                    (selectedAction?.fileId === file.id &&
                                      selectedAction?.action === "summary") ||
                                    isDeleting
                                  }
                                  variant="outline"
                                  className="gap-1 sm:gap-2 justify-center h-8 sm:h-9"
                                  size="sm"
                                >
                                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm truncate">
                                    {selectedAction?.fileId === file.id &&
                                    selectedAction?.action === "summary"
                                      ? "Generating..."
                                      : "Summaries"}
                                  </span>
                                </Button>

                                <Button
                                  onClick={() =>
                                    handleGenerateContent(
                                      file.id,
                                      file.fileName,
                                      "flashcards",
                                    )
                                  }
                                  disabled={
                                    (selectedAction?.fileId === file.id &&
                                      selectedAction?.action ===
                                        "flashcards") ||
                                    isDeleting
                                  }
                                  variant="outline"
                                  className="gap-1 sm:gap-2 justify-center h-8 sm:h-9"
                                  size="sm"
                                >
                                  <Layers className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm truncate">
                                    {selectedAction?.fileId === file.id &&
                                    selectedAction?.action === "flashcards"
                                      ? "Generating..."
                                      : "Flashcards"}
                                  </span>
                                </Button>

                                <Button
                                  onClick={() =>
                                    handleGenerateContent(
                                      file.id,
                                      file.fileName,
                                      "qa",
                                    )
                                  }
                                  disabled={
                                    (selectedAction?.fileId === file.id &&
                                      selectedAction?.action === "qa") ||
                                    isDeleting
                                  }
                                  variant="outline"
                                  className="gap-1 sm:gap-2 justify-center h-8 sm:h-9"
                                  size="sm"
                                >
                                  <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm truncate">
                                    {selectedAction?.fileId === file.id &&
                                    selectedAction?.action === "qa"
                                      ? "Generating..."
                                      : "Q&A"}
                                  </span>
                                </Button>
                              </div>

                              {/* Delete Button Only - Full width on mobile */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    handleDeleteFile(file.id, file.fileName)
                                  }
                                  disabled={isDeleting}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 sm:gap-2 w-full justify-center h-8 sm:h-9 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isDeleting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                                      <span className="text-xs sm:text-sm">
                                        Deleting...
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span className="text-xs sm:text-sm">
                                        Delete File
                                      </span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
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
