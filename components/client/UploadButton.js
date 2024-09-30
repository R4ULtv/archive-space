"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@headlessui/react";
import { ArrowUpTrayIcon, ArrowUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import saveFile from "@/components/server/SaveFile";
import TokenGenerator from "@/components/server/TokenGenerator";

const MAX_FILES = 10;
const UPLOAD_TIMEOUT = 30000; // 30 seconds timeout for each chunk
const MAX_RETRIES = 3;

const calculateChunkSize = (fileSize) => {
  const minChunkSize = 5 * 1024 * 1024;
  const maxChunkSize = 95 * 1024 * 1024;
  const fileSizeMB = fileSize / (1024 * 1024);

  if (fileSizeMB <= 50) return minChunkSize;
  if (fileSizeMB <= 300) return minChunkSize + Math.floor(((fileSizeMB - 50) / 250) * 30 * 1024 * 1024);
  if (fileSizeMB <= 1500) return 35 * 1024 * 1024 + Math.floor(((fileSizeMB - 300) / 1200) * 60 * 1024 * 1024);
  return maxChunkSize;
};

export default function UploadButton({ fetchURL }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [fileProgress, setFileProgress] = useState({});

  const uploadChunkWithTimeout = useCallback(async (url, formData, token, timeout) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Upload timed out");
      }
      throw error;
    }
  }, []);

  const uploadFile = useCallback(async (file, token) => {
    const chunkSize = calculateChunkSize(file.size);
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadedParts = [];

    const createResponse = await fetch(`${fetchURL}/${encodeURIComponent(file.name)}?action=mpu-create`, {
      method: "POST",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { uploadId } = await createResponse.json();

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const uploadPartResponse = await uploadChunkWithTimeout(
            `${fetchURL}/${encodeURIComponent(file.name)}?action=mpu-uploadpart&uploadId=${uploadId}&partNumber=${i + 1}`,
            formData,
            token,
            UPLOAD_TIMEOUT
          );

          uploadedParts.push(uploadPartResponse);
          setFileProgress((prev) => ({
            ...prev,
            [file.name]: { status: "uploading", progress: ((i + 1) / totalChunks) * 80 + 10 },
          }));
          break; // Success, exit retry loop
        } catch (error) {
          retries++;
          if (retries >= MAX_RETRIES) {
            toast.error(`Failed to upload chunk ${i + 1} of ${totalChunks} after ${MAX_RETRIES} attempts.`, { description: error.message });
            return false;
          }
          toast.warning(`Retrying chunk ${i + 1} (Attempt ${retries + 1} of ${MAX_RETRIES})`, { description: error.message });
        }
      }
    }

    const completeResponse = await fetch(
      `${fetchURL}/${encodeURIComponent(file.name)}?action=mpu-complete&uploadId=${uploadId}`,
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
      toast.error("Failed to complete the upload.", { description: "Something went wrong." });
      return false;
    }

    return true;
  }, [fetchURL, uploadChunkWithTimeout]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  }, []);

  const onFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_FILES) {
      toast.warning(`You can only upload up to ${MAX_FILES} files at a time.`);
      return;
    }
    if (files.length === 0) return;

    setLoading(true);
    setFileProgress(Object.fromEntries(files.map((file) => [file.name, { status: "idle", progress: 0 }])));

    try {
      for (const file of files) {
        const token = await TokenGenerator({ fileName: file.name, type: "upload" });
        if (token.error) {
          toast.error("Something went wrong.", { description: token.error });
          setFileProgress((prev) => ({ ...prev, [file.name]: { status: "error", progress: 100 } }));
        } else {
          setFileProgress((prev) => ({ ...prev, [file.name]: { status: "uploading", progress: 10 } }));

          const result = await uploadFile(file, token);
          if (result) {
            setFileProgress((prev) => ({ ...prev, [file.name]: { status: "finishing", progress: 90 } }));

            const save = await saveFile({
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
            });

            if (save) {
              setFileProgress((prev) => ({ ...prev, [file.name]: { status: "done", progress: 100 } }));
            }
          } else {
            setFileProgress((prev) => ({ ...prev, [file.name]: { status: "error", progress: 100 } }));
          }
        }
      }
    } catch (error) {
      toast.error("Something went wrong.", { description: error.message });
    } finally {
      router.refresh();
      setFileProgress({});
      setLoading(false);
    }
  }, [router, uploadFile]);

  const buttonClasses = useMemo(() => `relative w-full flex flex-col items-center justify-center p-8 border border-dashed rounded-md ${
    dragActive ? "border-zinc-500 bg-zinc-200 dark:bg-zinc-800" : "border-zinc-500"
  }`, [dragActive]);

  return (
    <Button
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      disabled={loading}
      onClick={() => fileInputRef.current?.click()}
      className={buttonClasses}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
        multiple
      />
      {loading ? (
        <FileProgressDisplay fileProgress={fileProgress} />
      ) : (
        <UploadPrompt />
      )}
    </Button>
  );
}

const FileProgressDisplay = ({ fileProgress }) => (
  <div className="w-full space-y-2">
    {Object.entries(fileProgress).map(([fileName, fileInfo]) => (
      <div key={fileName} className="flex flex-row items-center">
        <span className="text-sm">{fileName}</span>
        <ProgressIndicator status={fileInfo.status} progress={fileInfo.progress} />
      </div>
    ))}
  </div>
);

const ProgressIndicator = ({ status, progress }) => {
  if (status === "done") {
    return (
      <div className="rounded-full flex items-center justify-center p-[3px] bg-zinc-700 dark:bg-zinc-300 size-4 ml-auto">
        <ArrowUpIcon className="size-full text-zinc-100 dark:text-zinc-900" />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="rounded-full flex items-center justify-center p-[3px] bg-zinc-700 dark:bg-zinc-300 size-4 ml-auto">
        <XMarkIcon className="size-full text-zinc-100 dark:text-zinc-900" />
      </div>
    );
  }
  return (
    <svg className="size-4 -rotate-90 text-zinc-700 dark:text-zinc-300 ml-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - progress} strokeLinecap="round" className="transition-all duration-300 ease-in"></circle>
    </svg>
  );
};

const UploadPrompt = () => (
  <>
    <ArrowUpTrayIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
    <p className="text-center mt-1.5 text-sm text-zinc-500">
      Drag and drop files here or click to select.
    </p>
    <p className="text-center text-sm text-zinc-500">
      Max ({MAX_FILES}) files per upload.
    </p>
  </>
);