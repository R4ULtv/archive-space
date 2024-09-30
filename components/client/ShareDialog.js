"use client";

import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import ShareFile from "@/components/server/ShareFile";
import { ShareIcon } from "@heroicons/react/16/solid";

export function ShareDialog({
  fileName,
  publicFile,
  isOpen,
  setIsOpen,
  publicURL,
}) {
  const [isShared, setIsShared] = useState(publicFile);
  const shareLink = isShared ? `${publicURL}/${fileName}` : "";

  const router = useRouter();

  const handleShare = useCallback(async () => {
    setIsShared((prev) => !prev);
    try {
      const res = await ShareFile(fileName);
      if (res.error) {
        throw new Error(res.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.", {
        description: error.message,
      });
    }
  }, [fileName, router]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard.");
  }, [shareLink]);

  return (
    <Dialog
      transition
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition duration-150 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-xl space-y-4 border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
        >
          <DialogTitle className="font-bold">Share your File</DialogTitle>
          {isShared ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your file is now publicly accessible. Ensure you haven't made a
                private file public.
              </p>
              <div className="p-2 border border-zinc-400 dark:border-zinc-600 rounded-lg flex items-center justify-between mt-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 overflow-hidden truncate">
                  {shareLink}
                </p>
                <button onClick={handleCopy} className="pl-2">
                  <ShareIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sharing this file will make it publicly accessible. Ensure you're
              not sharing private content.
            </p>
          )}
          <div className="flex items-center justify-end gap-3 font-semibold">
            <button
              onClick={() => setIsOpen(false)}
              className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
            >
              Close
            </button>
            <button
              onClick={handleShare}
              className="bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
            >
              {isShared ? "Make it Private" : "Share"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
