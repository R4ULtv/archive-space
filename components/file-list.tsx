"use client";

import FileListSkeleton from "@/components/file-list-skeleton";
import { Button } from "@/components/ui/button";
import { getFileIcon } from "@/components/utils/file-icon";
import { useCategoryFilter } from "@/hooks/use-category-filters";
import { formatBytes } from "@/hooks/use-file-upload";
import {
  getFileTypeCategory,
  getMimeTypeFromExtension,
  isPreviewSupported,
} from "@/lib/mime-type";
import {
  FILES_CACHE_KEY,
  OBJECTS_CACHE_KEY,
  StorageObject,
  useFiles,
} from "@/lib/use-files";
import { cn } from "@/lib/utils";
import {
  DownloadIcon,
  FolderClosedIcon,
  FolderOpenIcon,
  TrashIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { mutate } from "swr";

const MediaPreview = dynamic(() =>
  import("../components/media-preview").then((mod) => mod.MediaPreview),
);

const FileItem = ({
  file,
  onDelete,
  isGrid = false,
}: {
  file: StorageObject;
  onDelete: (key: string) => void;
  isGrid?: boolean;
}) => {
  const mimeType = useMemo(
    () => getMimeTypeFromExtension(file.key),
    [file.key],
  );
  const mediaURL = useMemo(
    () => `${FILES_CACHE_KEY}/${encodeURIComponent(file.key)}`,
    [file.key],
  );

  const handleDeleteClick = useCallback(() => {
    onDelete(file.key);
  }, [file.key, onDelete]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border p-2 pe-3",
        isGrid && "flex-col",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 overflow-hidden",
          isGrid && "flex-col",
        )}
      >
        <div
          className={cn(
            "flex aspect-square shrink-0 items-center justify-center rounded border",
            isGrid ? "size-12 [&_svg]:size-5" : "size-10",
          )}
        >
          {getFileIcon({
            file: {
              name: mediaURL,
              type: mimeType,
            },
          })}
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-col gap-0.5",
            isGrid && "items-center",
          )}
        >
          <p className="truncate text-[13px] font-medium max-w-28 md:max-w-full">
            {file.key}
          </p>
          <p className="text-muted-foreground text-xs">
            {new Date(file.uploaded).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {formatBytes(file.size)}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {isPreviewSupported(getMimeTypeFromExtension(file.key)) && (
          <MediaPreview
            src={mediaURL}
            type={getMimeTypeFromExtension(file.key)}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground/80"
          asChild
        >
          <a href={mediaURL} target="_blank" download>
            <DownloadIcon className="size-3.5" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 group text-muted-foreground/80 hover:bg-destructive/25 dark:hover:bg-destructive/25"
          onClick={handleDeleteClick}
        >
          <TrashIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

const FolderItem = ({
  folder,
  current = false,
  isGrid = false,
}: {
  folder: string;
  current?: boolean;
  isGrid?: boolean;
}) => (
  <Link
    href={folder}
    className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex aspect-square shrink-0 items-center justify-center rounded border size-10">
        {current ? (
          <FolderOpenIcon className="size-4 opacity-60" />
        ) : (
          <FolderClosedIcon className="size-4 opacity-60" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-[13px] font-medium max-w-28 md:max-w-full">
          {folder}
        </p>
      </div>
    </div>
  </Link>
);

export default function FileList() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const { categories } = useCategoryFilter();
  const { folder } = useParams<{ folder: string | undefined }>();
  const { files, folders, error, isLoading } = useFiles({ folder });

  const processedFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    const sortedFiles = [...files].sort(
      (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime(),
    );

    const sortedFilesWithoutFolder = sortedFiles.map((file) => {
      const keyParts = file.key.split("/");
      return {
        ...file,
        key: keyParts.length > 1 ? keyParts.slice(1).join("/") : file.key,
      };
    });

    return sortedFilesWithoutFolder.filter((file) => {
      const matchesSearch = file.key
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        !categories ||
        categories.length === 0 ||
        categories.includes(getFileTypeCategory(file.key));

      return matchesSearch && matchesCategory;
    });
  }, [files, search, categories]);

  const handleDelete = useCallback(async (key: string) => {
    try {
      await fetch(`${FILES_CACHE_KEY}/${encodeURIComponent(key)}`, {
        method: "DELETE",
        credentials: "include",
      });
      mutate(OBJECTS_CACHE_KEY);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full space-y-2">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error: {error?.message || String(error)}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <FileListSkeleton count={8} />;
  }

  if (!files || files.length === 0) {
    return (
      <div className="w-full space-y-2">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No files found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {folders &&
        folders.map((folder) => <FolderItem key={folder} folder={folder} />)}
      {processedFiles.map((file) => (
        <FileItem key={file.key} file={file} onDelete={handleDelete} />
      ))}
    </div>
  );
}
