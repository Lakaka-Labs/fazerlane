"use client";

import { uploadFile } from "@/services/mutations/storage/upload";
import { FileData } from "@/types/api/challenges/tasks";
import { useMutation } from "@tanstack/react-query";
import { LoaderPinwheel, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (selectedFiles.length === 0) return;

    addFiles([selectedFiles[0]]);
    handleUploadFiles([selectedFiles[0]]);

    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    console.log("files???", { files });

    const newFormData = new FormData();
    filesToUpload.forEach((file) => newFormData.append("files", file));

    const res = await mutate.mutateAsync(newFormData).finally(() => {
      setIsLoading(false);
    });
    console.log("res from handleUploadFiles", res);

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

  return (
    <div>
      <div
        className={`bg-brand-background-dashboard relative flex h-[200px] items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging ? "border-blue-500" : "border-brand-black/60"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-brand-grey">
          <p className="mb-2 text-base font-normal">
            Drop your video, image or audio here or{" "}
            <button
              onClick={handleBrowseClick}
              className="text-brand-black font-medium underline underline-offset-3"
            >
              browse
            </button>
          </p>
          <p className="text-sm">Max file size: 500mb</p>
        </div>
      </div>

      {isLoading && (
        <div className="text-brand-grey flex justify-center gap-4 pt-6">
          <p className="text-center">Uploading</p>
          <LoaderPinwheel size={24} className="animate-spin" />
        </div>
      )}

      {fileLink.length > 0 &&
        files.length > 0 &&
        fileLink.length === files.length && (
          <div className="flex flex-col gap-4">
            <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-medium text-gray-900">Uploaded Files</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="line-clamp-1 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(fileLink[index], file.id)}
                      className="rounded bg-black p-1 transition-colors hover:bg-black/50"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
