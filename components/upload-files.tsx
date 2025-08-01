"use client";

import { AlertCircleIcon, FileUpIcon } from "lucide-react";
import * as React from "react";
import { mutate } from "swr";

import { getFileIcon } from "@/components/utils/file-icon";
import { ProgressIndicator } from "@/components/utils/progress-indicator";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { calculateOptimalChunkSize } from "@/lib/optimal-chunk-size";
import { FILES_CACHE_KEY } from "@/lib/use-files";

// Type for tracking upload progress and status
type UploadStatus = {
  fileId: string;
  progress: number;
  completed: boolean;
  error?: string;
  uploading: boolean;
};

export default function Component() {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB default
  const maxFiles = 10;

  // State to track upload progress for each file
  const [uploadStatuses, setUploadStatuses] = React.useState<UploadStatus[]>(
    [],
  );

  // Function to upload a single file using multipart upload
  const uploadFile = async (file: File, fileId: string): Promise<void> => {
    const chunkSize = calculateOptimalChunkSize(file.size);
    const totalChunks = Math.ceil(file.size / chunkSize);

    try {
      // Initialize upload status
      setUploadStatuses((prev) =>
        prev.map((status) =>
          status.fileId === fileId
            ? { ...status, uploading: true, progress: 0, error: undefined }
            : status,
        ),
      );

      // Step 1: Create multipart upload
      const createResponse = await fetch(
        `${FILES_CACHE_KEY}/${encodeURIComponent(file.name)}?action=mpu-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!createResponse.ok) {
        throw new Error(
          `Failed to create multipart upload: ${createResponse.statusText}`,
        );
      }

      const { uploadId } = await createResponse.json();

      // Step 2: Upload parts
      const uploadedParts: { partNumber: number; etag: string }[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;

        const partResponse = await fetch(
          `${FILES_CACHE_KEY}/${encodeURIComponent(
            file.name,
          )}?action=mpu-uploadpart&uploadId=${uploadId}&partNumber=${partNumber}`,
          {
            method: "PUT",
            body: chunk,
            headers: {
              "Content-Type": "application/octet-stream",
            },
            credentials: "include",
          },
        );

        if (!partResponse.ok) {
          throw new Error(
            `Failed to upload part ${partNumber}: ${partResponse.statusText}`,
          );
        }

        const partData = await partResponse.json();
        uploadedParts.push({
          partNumber: partNumber,
          etag: partData.etag,
        });

        // Update progress
        const progress = Math.round(((i + 1) / totalChunks) * 100);
        setUploadStatuses((prev) =>
          prev.map((status) =>
            status.fileId === fileId ? { ...status, progress } : status,
          ),
        );
      }

      // Step 3: Complete multipart upload
      const completeResponse = await fetch(
        `${FILES_CACHE_KEY}/${encodeURIComponent(
          file.name,
        )}?action=mpu-complete&uploadId=${uploadId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            parts: uploadedParts,
          }),
        },
      );

      if (!completeResponse.ok) {
        throw new Error(
          `Failed to complete multipart upload: ${completeResponse.statusText}`,
        );
      }

      // Mark as completed
      setUploadStatuses((prev) =>
        prev.map((status) =>
          status.fileId === fileId
            ? { ...status, completed: true, uploading: false, progress: 100 }
            : status,
        ),
      );

      // Refresh the file list cache
      const revalidate = await mutate(FILES_CACHE_KEY);
      if (revalidate) handleFileRemoved(fileId);
    } catch (error) {
      console.error("Upload failed:", error);

      // Mark as failed
      setUploadStatuses((prev) =>
        prev.map((status) =>
          status.fileId === fileId
            ? {
                ...status,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload failed",
                progress: 0,
              }
            : status,
        ),
      );
    }
  };

  // Handle newly added files - start upload immediately
  const handleFilesAdded = React.useCallback(
    (addedFiles: FileWithPreview[]) => {
      // Initialize upload status for each new file
      const newStatuses = addedFiles.map((file) => ({
        fileId: file.id,
        progress: 0,
        completed: false,
        uploading: false,
        error: undefined,
      }));

      setUploadStatuses((prev) => [...prev, ...newStatuses]);

      // Start upload for each file
      addedFiles.forEach((file) => {
        if (file.file instanceof File) {
          uploadFile(file.file, file.id);
        }
      });
    },
    [],
  );

  // Handle file removal - clean up upload status
  const handleFileRemoved = React.useCallback((fileId: string) => {
    setUploadStatuses((prev) =>
      prev.filter((status) => status.fileId !== fileId),
    );
    removeFile(fileId);
  }, []);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      removeFile,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    onFilesAdded: handleFilesAdded,
  });

  // Get upload status for a specific file
  const getUploadStatus = (fileId: string) => {
    return uploadStatuses.find((status) => status.fileId === fileId);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileUpIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            <span>All files</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatBytes(maxSize)}</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const uploadStatus = getUploadStatus(file.id);
            const hasError = uploadStatus?.error;
            const progress = uploadStatus?.progress || 0;

            return (
              <div
                key={file.id}
                className="bg-background flex flex-col gap-2 rounded-lg border p-2 pe-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-[13px] font-medium">
                        {file.file instanceof File
                          ? file.file.name
                          : file.file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(
                          file.file instanceof File
                            ? file.file.size
                            : file.file.size,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ProgressIndicator progress={progress} />
                  </div>
                </div>

                {/* Error message */}
                {hasError && (
                  <div className="text-destructive flex items-center gap-1 text-xs">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{hasError}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
