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
import { useState } from "react";

import ShareFile from "@/components/server/ShareFile";
import { ShareIcon } from "@heroicons/react/16/solid";

export function ShareDialog({
  fileName,
  publicFile,
  isOpen,
  setIsOpen,
  publicURL,
}) {
  const [share, setShare] = useState(publicFile);
  const shareLink = publicFile ? publicURL + "/" + fileName : "";

  const router = useRouter();

  const onSubmitShare = async () => {
    setShare(!share);
    const res = await ShareFile(fileName);
    if (res) {
      if (res.error) {
        toast.error("Something went wrong.", {
          description: res.error,
        });
      } else {
        router.refresh(); // Refresh the router if deletion was successful
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard.");
  };

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
          {share ? (
            <>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                Your file is now publicly accessible. Make sure you have not
                made a private file public.
              </div>

              <div className="p-2 border border-zinc-400 dark:border-zinc-600 rounded-lg flex items-center justify-between mt-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 overflow-hidden truncate">
                  {shareLink}
                </p>
                <Button onClick={handleCopy} className="pl-2">
                  <ShareIcon className="size-4 text-zinc-700 dark:text-zinc-300" />
                </Button>
              </div>

              <div className="flex items-center justify-end gap-3 font-semibold">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => onSubmitShare()}
                  className="bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
                >
                  Make it Private
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                If you want to share this file, the link will become public and
                everyone on the internet will be able to access this file. Make
                sure you don't share anything private.
              </div>

              <div className="flex items-center justify-end gap-3 font-semibold">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => onSubmitShare()}
                  className="bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
                >
                  Share
                </Button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
