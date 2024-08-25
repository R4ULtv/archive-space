"use client";

import { useState } from "react";
import { Button } from "@headlessui/react";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";

import LoadingCircle from "@/components/LoadingCircle";
import TokenGenerator from "@/components/server/TokenGenerator";

export default function DownloadButton({ fileName, fetchURL }) {
  const [loading, setLoading] = useState(false);

  const onSubmitDownload = async (e) => {
    setLoading(true);
    try {
      const token = await TokenGenerator({
        fileName: encodeURIComponent(fileName),
        type: "download",
      });

      const response = await fetch(
        `${fetchURL}/${encodeURIComponent(fileName)}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        }
      );

      if (!response.ok) {
        toast.error("Something went wrong.", {
          description: "Failed to download file.",
        });
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

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
