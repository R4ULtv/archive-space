"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@headlessui/react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [fileProgress, setFileProgress] = useState({});

  const onFileSelect = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lastModified", file.lastModified);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      toast.error("Something went wrong.", {
        description: "Failed to upload file.",
      });
    }

    return await response.json();
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  }, []);

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setFileProgress((prev) => ({
      ...prev,
      ...Object.fromEntries(files.map((file) => [file.name, 0])),
    }));

    try {
      for (const file of files) {
        const result = await uploadFile(file);
        if (result) {
          setFileProgress((prev) => ({ ...prev, [file.name]: 100 }));
        }
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        description: error,
      });
    } finally {
      router.refresh()
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
            {Object.entries(fileProgress).map(([fileName, progress]) => (
              <div key={fileName} className="flex flex-row items-center">
                <span className="text-sm">{fileName}</span>
                <div className="relative size-5 ml-auto">
                  <svg
                    className="size-full -rotate-90"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-zinc-200 dark:text-zinc-800"
                      strokeWidth="4"
                    ></circle>
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-zinc-900 dark:text-zinc-100"
                      strokeWidth="4"
                      strokeDasharray="100"
                      strokeDashoffset={100 - progress}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
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
            Max file size: 300 MB.
          </p>
        </>
      )}
    </Button>
  );
}
