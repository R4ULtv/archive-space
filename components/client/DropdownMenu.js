"use client";

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { EditDialog } from "@/components/client/EditFunction";
import { DeleteDialog } from "@/components/client/DeleteFunction";
import { onSubmitDownload } from "@/components/client/DownloadFunction";
import { ShareDialog } from "@/components/client/ShareDialog";

import FavoriteFile from "@/components/server/FavoriteFile";

export default function DropdownMenu({ file, categories, fetchURL, publicURL }) {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <Menu>
      <MenuButton className="p-1.5 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 outline-none">
        <span className="sr-only">Open menu</span>
        <EllipsisVerticalIcon className="size-4 text-zinc-700 dark:text-zinc-300" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-max origin-top-right bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-md p-1 text-sm transition duration-75 ease-in-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-90 data-[closed]:opacity-0"
      >
        <MenuItem>
          <Button
            onClick={() => onSubmitDownload({ fileName: file.name, fetchURL })}
            className="group flex w-full items-center gap-2 rounded py-1.5 px-3 data-[focus]:bg-zinc-200 dark:data-[focus]:bg-zinc-800"
          >
            <ArrowDownTrayIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
            Download
            <kbd className="ml-auto hidden tracking-widest font-semibold text-xs text-zinc-500 group-data-[focus]:inline">
              ⌘W
            </kbd>
          </Button>
        </MenuItem>

        <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

        <MenuItem>
          <Button
            onClick={() => setIsEditOpen(true)}
            className="group flex w-full items-center gap-2 rounded py-1.5 px-3 data-[focus]:bg-zinc-200 dark:data-[focus]:bg-zinc-800"
          >
            <PencilIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
            Edit
            <kbd className="ml-auto hidden tracking-widest font-semibold text-xs text-zinc-500 group-data-[focus]:inline">
              ⌘E
            </kbd>
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            onClick={() => {
              FavoriteFile(file.name);
              router.refresh();
            }}
            className="group flex w-full items-center gap-2 rounded py-1.5 px-3 data-[focus]:bg-zinc-200 dark:data-[focus]:bg-zinc-800"
          >
            <StarIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
            {file.favorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => setIsShareOpen(true)} className="group flex w-full items-center gap-2 rounded py-1.5 px-3 data-[focus]:bg-zinc-200 dark:data-[focus]:bg-zinc-800">
            <ShareIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
            Share
            <kbd className="ml-auto hidden tracking-widest font-semibold text-xs text-zinc-500 group-data-[focus]:inline">
              ⌘S
            </kbd>
          </Button>
        </MenuItem>

        <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

        <MenuItem>
          <Button
            onClick={() => setIsDeleteOpen(true)}
            className="group flex w-full items-center gap-2 rounded py-1.5 px-3 data-[focus]:bg-zinc-200 dark:data-[focus]:bg-zinc-800"
          >
            <TrashIcon className="size-4 text-zinc-600 dark:text-zinc-400" />
            Delete
            <kbd className="ml-auto hidden tracking-widest font-semibold text-xs text-zinc-500 group-data-[focus]:inline">
              ⌘D
            </kbd>
          </Button>
        </MenuItem>
      </MenuItems>
      
      <ShareDialog
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
        fileName={file.name}
        publicFile={file.public}
        publicURL={publicURL}
      />
      <EditDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        fileName={file.name}
        category={
          file.category.charAt(0).toUpperCase() + file.category.slice(1)
        }
        categories={categories}
        oldTags={file.tags}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        fileName={file.name}
      />
    </Menu>
  );
}
