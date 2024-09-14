"use client";

import { toast } from "sonner";
import TokenGenerator from "@/components/server/TokenGenerator";

export const onSubmitDownload = async ({ fetchURL, fileName }) => {
  try {
    const token = await TokenGenerator({
      fileName: fileName,
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
      return;
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
};