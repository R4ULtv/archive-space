"use client";

import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { DeleteFile } from "@/components/server/DeleteFile";
import LoadingCircle from "@/components/LoadingCircle";

export default function DeleteButton({ fileName }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmitDelete = async () => {
    setIsOpen(false);
    setLoading(true);

    const res = await DeleteFile(encodeURIComponent(fileName));
    if (res) {
      if (res.error) {
        toast.error("Something went wrong.", {
          description: res.error,
        });
      } else {
        router.refresh(); // Refresh the router if deletion was successful
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        disabled={loading}
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
      >
        {loading ? (
          <LoadingCircle className="size-4 text-zinc-700 dark:text-zinc-300" />
        ) : (
          <TrashIcon className="size-4 text-zinc-700 dark:text-zinc-300" />
        )}
      </Button>

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
            <DialogTitle className="font-bold">Delete Files</DialogTitle>

            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
              <p>This action will permanently delete this file:</p>
              <p className="font-semibold italic">{fileName}</p>
              <p>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 font-semibold">
              <Button
                onClick={() => setIsOpen(false)}
                className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSubmitDelete()}
                className="bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
              >
                Delete
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
