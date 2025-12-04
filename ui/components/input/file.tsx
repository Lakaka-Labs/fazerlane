"use client";

import { uploadFile } from "@/services/mutations/storage/upload";
import { FileData } from "@/types/api/challenges/tasks";
import { useMutation } from "@tanstack/react-query";
import {
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  fileLink: string[];
  setFileLink: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FileUpload({ fileLink, setFileLink }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutate = useMutation({
    mutationFn: (files: FormData) => uploadFile(files),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to upload files");
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 1) {
      toast.error("Please upload only one file at a time");
      return;
    }

    if (droppedFiles.length === 0) return;

    addFiles([droppedFiles[0]]);
    handleUploadFiles([droppedFiles[0]]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    if (selectedFiles.length > 1) {
      toast.error("Please upload only one file at a time");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFiles.length === 0) return;

    addFiles([selectedFiles[0]]);
    handleUploadFiles([selectedFiles[0]]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addFiles = (newFiles: File[]): void => {
    const fileData: FileData[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      file: file,
    }));
    setFiles((prev) => [...prev, ...fileData]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const removeFile = (fileData: string, randomId: string): void => {
    setFileLink((prev) => prev.filter((file) => file !== fileData));
    setFiles((prev) => prev.filter((file) => file.id !== randomId));
  };

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  async function handleUploadFiles(filesToUpload: File[]) {
    setIsLoading(true);
    const newFormData = new FormData();
    filesToUpload.forEach((file) => newFormData.append("files", file));

    const res = await mutate.mutateAsync(newFormData).finally(() => {
      setIsLoading(false);
    });

    if (res) {
      toast.success("File upload successful!");
      setFileLink((prev) => [...prev, ...res]);
    } else {
      toast.error("Failed to upload file");
      setFiles((prev) =>
          prev.filter((file) => !filesToUpload.includes(file.file))
      );
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return <Film className="h-5 w-5 text-purple-500" />;
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return <Music className="h-5 w-5 text-pink-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
      <div className="w-full space-y-4">
        <div
            className={cn(
                "relative group flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden",
                isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-gray-300 bg-gray-50/50 hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50",
                isLoading && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
        >
          <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3 text-center p-6 transition-transform duration-200 group-hover:scale-105">
            <div className={cn(
                "p-3 rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10",
                isDragging && "ring-primary/20"
            )}>
              {isLoading ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                  <UploadCloud className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      isDragging ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                  )} />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {isLoading ? (
                    "Uploading your files..."
                ) : (
                    <>
                      <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                    </>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or MP4 (max. 500MB)
              </p>
            </div>
          </div>

          {/* Animated Border Overlay */}
          {isDragging && (
              <div className="absolute inset-0 pointer-events-none border-2 border-primary rounded-xl animate-pulse" />
          )}
        </div>

        {/* Uploaded Files List */}
        {fileLink.length > 0 && files.length > 0 && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                Uploaded Files ({files.length})
              </h4>

              <div className="grid gap-2">
                {files.map((file, index) => (
                    fileLink[index] && (
                        <div
                            key={file.id}
                            className="group relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                        >
                          <div className="flex-shrink-0 rounded-md bg-gray-50 p-2 dark:bg-gray-900">
                            {getFileIcon(file.name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                {file.name}
                              </p>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            </div>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>

                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(fileLink[index], file.id);
                              }}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                              title="Remove file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                    )
                ))}
              </div>
            </div>
        )}
      </div>
  );
}
