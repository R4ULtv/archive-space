"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@headlessui/react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { ArrowUpIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import saveFile from "@/components/server/SaveFile";
import TokenGenerator from "@/components/server/TokenGenerator";

export default function UploadButton({ fetchURL }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [fileProgress, setFileProgress] = useState({});

  const maxFiles = 8;

  const onFileSelect = () => {
    fileInputRef.current.click();
  };

  function calculateChunkSize(fileSize) {
    const minChunkSize = 5;
    const maxChunkSize = 95;

    const fileSizeMB = fileSize / (1024 * 1024);

    let chunkSize = minChunkSize;

    if (fileSizeMB <= 50) {
      chunkSize = minChunkSize; // Small Files: chunk fixed to 5 MB
    } else if (fileSizeMB <= 300) {
      chunkSize =
        minChunkSize +
        Math.floor(((fileSizeMB - 50) / (300 - 50)) * (30 - minChunkSize)); // Medium Files: chunk from 5 MB up to 35 MB
    } else if (fileSizeMB <= 1500) {
      chunkSize =
        35 +
        Math.floor(((fileSizeMB - 300) / (1500 - 300)) * (maxChunkSize - 35)); // Big Files: chunk from 35 MB up to 95 MB
    } else {
      chunkSize = maxChunkSize; // Very Big Files: chunk fixed to 95 MB
    }

    return chunkSize * 1024 * 1024;
  }

  const uploadFile = async (file, token) => {
    // Determine chunk size based on file size
    const chunkSize = calculateChunkSize(file.size);

    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadedParts = [];

    // Step 1: Create a multipart upload
    const createResponse = await fetch(
      `${fetchURL}/${encodeURIComponent(file.name)}?action=mpu-create`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { uploadId } = await createResponse.json();

    for (let i = 0; i < totalChunks; i++) {
      // Calculate start and end byte for each chunk
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // Step 2: Upload each part
      const uploadPartResponse = await fetch(
        `${fetchURL}/${encodeURIComponent(
          file.name
        )}?action=mpu-uploadpart&uploadId=${uploadId}&partNumber=${i + 1}`,
        {
          method: "PUT",
          mode: "cors",
          body: chunk,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!uploadPartResponse.ok) {
        toast.error(`Failed to upload chunk ${i + 1} of ${totalChunks}.`, {
          description: "Something went wrong.",
        });
        return;
      }
      const response = await uploadPartResponse.json();
      uploadedParts.push(response);

      setFileProgress((prev) => ({
        ...prev,
        [file.name]: {
          status: "uploading",
          progress: (i / totalChunks) * 80 + 10,
        }, // from 10 to 90
      }));
    }

    // Step 3: Complete the multipart upload
    const completeResponse = await fetch(
      `${fetchURL}/${encodeURIComponent(
        file.name
      )}?action=mpu-complete&uploadId=${uploadId}`,
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ parts: uploadedParts }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!completeResponse.ok) {
      toast.error("Failed to complete the upload.", {
        description: "Something went wrong.",
      });
    }

    return true;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Manage drag state based on event type
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop event
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  }, []);

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > maxFiles) {
      toast.warning(`You can only upload up to ${maxFiles} files at a time.`);
      return;
    }
    if (files.length === 0) return;

    setLoading(true);
    // Initialize progress for each selected file
    setFileProgress((prev) => ({
      ...prev,
      ...Object.fromEntries(
        files.map((file) => [file.name, { status: "idle", progress: 0 }])
      ),
    }));

    try {
      for (const file of files) {
        // Generate token for the file upload
        const token = await TokenGenerator({
          fileName: encodeURIComponent(file.name),
          type: "upload",
        });
        if (token.error) {
          toast.error("Something went wrong.", {
            description: token.error,
          });
          setFileProgress((prev) => ({
            ...prev,
            [file.name]: { status: "error", progress: 100 },
          }));
        } else {
          setFileProgress((prev) => ({
            ...prev,
            [file.name]: { status: "uploading", progress: 10 },
          }));

          const result = await uploadFile(file, token);
          if (result) {
            setFileProgress((prev) => ({
              ...prev,
              [file.name]: { status: "finishing", progress: 90 },
            }));
          }

          // Save file metadata after upload
          const save = await saveFile({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          });

          if (save) {
            setFileProgress((prev) => ({
              ...prev,
              [file.name]: { status: "done", progress: 100 },
            }));
          }
        }
      }
    } catch (error) {
      // Handle any errors during the upload process
      toast.error("Something went wrong.", {
        description: error,
      });
    } finally {
      // Refresh the router and reset states
      router.refresh();
      setFileProgress({});
      setLoading(false);
    }
  };

  return (
    <Button
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      disabled={loading}
      onClick={onFileSelect}
      className={`relative w-full flex flex-col items-center justify-center p-8 border border-dashed rounded-md ${
        dragActive
          ? "border-zinc-500 bg-zinc-200 dark:bg-zinc-800"
          : "border-zinc-500"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
        multiple
      />
      {loading ? (
        Object.entries(fileProgress).length > 0 && (
          <div className="w-full space-y-2">
            {Object.entries(fileProgress).map(([fileName, fileInfo]) => (
              <div key={fileName} className="flex flex-row items-center">
                <span className="text-sm">{fileName}</span>
                <div className="relative ml-auto bg-transparent">
                  {fileInfo.status === "done" ? (
                    <div className="rounded-full flex items-center justify-center p-[3px] bg-zinc-700 dark:bg-zinc-300 size-4">
                      <ArrowUpIcon className="size-full text-zinc-100 dark:text-zinc-900" />
                    </div>
                  ) : fileInfo.status === "error" ? (
                    <div className="rounded-full flex items-center justify-center p-[3px] bg-zinc-700 dark:bg-zinc-300 size-4">
                      <XMarkIcon className="size-full text-zinc-100 dark:text-zinc-900" />
                    </div>
                  ) : (
                    <svg
                      className="size-4 -rotate-90 text-zinc-700 dark:text-zinc-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      ></circle>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - fileInfo.progress}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-in"
                      ></circle>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <ArrowUpTrayIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
          <p className="text-center mt-1.5 text-sm text-zinc-500">
            Drag and drop files here or click to select.
          </p>
          <p className="text-center text-sm text-zinc-500">
            Max ({maxFiles}) files per upload.
          </p>
        </>
      )}
    </Button>
  );
}
