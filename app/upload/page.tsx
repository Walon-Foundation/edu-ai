"use client";

import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingToServer, setIsSendingToServer] = useState(false);

  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    setIsDragging(false);

    // Limit to 3 files total
    const remainingSlots = 3 - uploadedFiles.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      return;
    }

    const newFiles: UploadedFile[] = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 3 - uploadedFiles.length,
    disabled: uploadedFiles.length >= 3 || isUploading,
  });

  const simulateUpload = (fileId: string) => {
    setIsUploading(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === fileId
              ? { ...file, progress: 100, status: "completed" }
              : file,
          ),
        );

        // Check if all uploads are done
        setTimeout(() => {
          const allDone = uploadedFiles.every((f) => f.status === "completed");
          if (allDone) {
            setIsUploading(false);
          }
        }, 500);

        return;
      }

      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, progress } : file)),
      );
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSendToServer = async () => {
    if (uploadedFiles.length === 0) return;

    setIsSendingToServer(true);

    try {
      // Create FormData to send files
      const formData = new FormData();

      uploadedFiles.forEach((fileInfo) => {
        formData.append("files", fileInfo.file);
      });

      // Send to your backend API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      router.push("/dashboard");

      // Show success message
      toast.success("Files successfully uploaded to server!");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
    } finally {
      setIsSendingToServer(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const allFilesCompleted =
    uploadedFiles.length > 0 &&
    uploadedFiles.every((file) => file.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upload Your PDFs
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Upload up to 3 PDF files to generate summaries, flashcards, and
            study materials. Our AI will process them instantly.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {/* Upload Card */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CloudUpload className="h-5 w-5 sm:h-6 sm:w-6" />
                Upload Files
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Drag and drop your PDF files here, or click to browse. Maximum 3
                files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-200
                  ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }
                  ${uploadedFiles.length >= 3 || isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  {isDragActive
                    ? "Drop the files here"
                    : "Drag & drop files here"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  or click to select files from your computer
                </p>
                <p className="text-xs text-gray-400">
                  Supported format: PDF • Max 3 files
                </p>

                {uploadedFiles.length >= 3 && (
                  <Alert className="mt-3 sm:mt-4 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 text-xs sm:text-sm">
                      Maximum file limit reached (3 files). Remove files to
                      upload more.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Action Buttons */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {uploadedFiles.length} of 3 files selected •{" "}
                    {allFilesCompleted
                      ? "Ready to process"
                      : "Processing files..."}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleSendToServer}
                      disabled={!allFilesCompleted || isSendingToServer}
                      className="gap-2 order-2 sm:order-1"
                      size="sm"
                    >
                      {isSendingToServer ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send to AI
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setUploadedFiles([])}
                      disabled={isUploading || isSendingToServer}
                      className="order-1 sm:order-2"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <Card className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Uploaded Files
                </CardTitle>
                <CardDescription>
                  {uploadedFiles.length} of 3 files uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 sm:h-56 lg:h-64">
                  <div className="space-y-3 sm:space-y-4">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className={
                                  getStatusColor(file.status) + " w-fit"
                                }
                              >
                                <span className="flex items-center gap-1 text-xs">
                                  {getStatusIcon(file.status)}
                                  {file.status.charAt(0).toUpperCase() +
                                    file.status.slice(1)}
                                </span>
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                              <span>{formatFileSize(file.file.size)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>PDF Document</span>
                            </div>

                            {file.status === "uploading" && (
                              <Progress
                                value={file.progress}
                                className="mt-2 h-1 sm:h-2"
                              />
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={
                            file.status === "uploading" || isSendingToServer
                          }
                          className="flex-shrink-0 ml-2"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Features Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      Smart Summaries
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Concise overview of key concepts
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      Flashcards
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Study cards for quick revision
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      Q&A Generator
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Practice questions and answers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  Upload Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <span>Ensure PDFs are readable and not scanned images</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <span>Each file should be under 50MB</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <span>Text-based PDFs work best for AI processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <span>You can upload multiple related documents</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
