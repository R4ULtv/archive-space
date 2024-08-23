"use client";

import { useState } from "react";
import { Button } from "@headlessui/react";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import LoadingCircle from "@/components/LoadingCircle";

export default function DownloadButton({ fileName }) {
  const [loading, setLoading] = useState(false);

  const onSubmitDownload = async (e) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/download?${new URLSearchParams("fileName=" + fileName)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        toast.error("Something went wrong.", {
          description: "Failed to download file.",
        });
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Something went wrong.", {
        description: error,
      });
    }
    setLoading(false);
  };

  return (
    <Button
      disabled={loading}
      onClick={() => onSubmitDownload()}
      className="p-1.5 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
    >
      {loading ? (
        <LoadingCircle className="size-4 text-zinc-700 dark:text-zinc-300" />
      ) : (
        <ArrowDownTrayIcon className="size-4 text-zinc-700 dark:text-zinc-300" />
      )}
    </Button>
  );
}
