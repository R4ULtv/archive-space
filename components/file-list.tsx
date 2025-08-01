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
import { FILES_CACHE_KEY, StorageObject, useFiles } from "@/lib/use-files";
import { DownloadIcon, TrashIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { mutate } from "swr";

const MediaPreview = dynamic(() =>
  import("../components/media-preview").then((mod) => mod.MediaPreview),
);

// Date formatter - created once and reused
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Memoized FileItem component to prevent unnecessary re-renders
const FileItem = ({
  file,
  onDelete,
}: {
  file: StorageObject;
  onDelete: (key: string) => void;
}) => {
  const fileCategory = useMemo(() => getFileTypeCategory(file.key), [file.key]);
  const mimeType = useMemo(
    () => getMimeTypeFromExtension(file.key),
    [file.key],
  );
  const formattedDate = useMemo(
    () => dateFormatter.format(new Date(file.uploaded)),
    [file.uploaded],
  );
  const mediaURL = useMemo(
    () => `${FILES_CACHE_KEY}/${encodeURIComponent(file.key)}`,
    [file.key],
  );

  const handleDeleteClick = useCallback(() => {
    onDelete(file.key);
  }, [file.key, onDelete]);

  return (
    <div className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
          {getFileIcon({
            file: {
              name: mediaURL,
              type: mimeType,
            },
          })}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[13px] font-medium">{file.key}</p>
          <p className="text-muted-foreground text-xs">
            {formattedDate} · {fileCategory} · {formatBytes(file.size)}
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

export default function FileList() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const { categories } = useCategoryFilter();
  const { files, error, isLoading } = useFiles();

  // Memoized file processing and filtering
  const processedFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    // Sort files by upload date (newest first)
    const sortedFiles = [...files].sort(
      (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime(),
    );

    // Filter files based on search and category
    return sortedFiles.filter((file) => {
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

  // Memoized delete handler to prevent recreation on every render
  const handleDelete = useCallback(async (key: string) => {
    try {
      await fetch(`${FILES_CACHE_KEY}/${encodeURIComponent(key)}`, {
        method: "DELETE",
        credentials: "include",
      });
      mutate(FILES_CACHE_KEY);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }, []);

  // Early returns for loading and error states
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

  // No files case
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
      {processedFiles.map((file) => (
        <FileItem key={file.key} file={file} onDelete={handleDelete} />
      ))}
    </div>
  );
}
