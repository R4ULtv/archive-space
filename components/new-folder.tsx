"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const isInputElement = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    element.contentEditable === "true" ||
    element.isContentEditable
  );
};

// Function to sanitize folder path for URL safety
const sanitizeFolderPath = (input: string): string => {
  return input
    .split("/") // Split by forward slashes to preserve folder structure
    .map(
      (segment) =>
        segment
          .trim() // Remove leading/trailing spaces
          .toLowerCase() // Convert to lowercase
          .replace(/\s+/g, "-") // Replace spaces with dashes
          .replace(/[^a-z0-9\-_.]/g, "") // Remove all characters except alphanumeric, dash, underscore, and dot
          .replace(/-+/g, "-") // Replace multiple consecutive dashes with single dash
          .replace(/^-+|-+$/g, ""), // Remove leading/trailing dashes
    )
    .filter((segment) => segment.length > 0) // Remove empty segments
    .join("/"); // Join back with forward slashes
};

export default function NewFolder({ basePath }: { basePath?: string }) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setInputValue("");
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (isInputElement(target)) return;

    if (event.key.toLowerCase() === "c") {
      event.preventDefault();
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedPath = sanitizeFolderPath(inputValue);
    if (sanitizedPath.length === 0) return;

    const fullPath = basePath ? `${basePath}/${sanitizedPath}` : sanitizedPath;
    router.push(`/${fullPath}`);
    handleClose();
  };

  const sanitizedPath = sanitizeFolderPath(inputValue);
  const fullPreviewPath = basePath
    ? `${basePath}/${sanitizedPath}`
    : sanitizedPath;
  const isDisabled = sanitizedPath.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LogoIcon className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <LogoIcon className="opacity-80" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">New Folder</DialogTitle>
            <DialogDescription className="text-left">
              Enter a name for your new folder. Use &quot/&quot to create
              subfolders. Special characters will be converted to URL-safe
              format.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Preview: </span>
                <code className="text-foreground font-mono">
                  /{fullPreviewPath}
                </code>
              </div>
              <Input
                ref={inputRef}
                id="folder-name"
                type="text"
                placeholder="music, video/movies, documents/work..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="shadow-none focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleClose();
                  }
                }}
              />
            </div>
          </div>
          <Button disabled={isDisabled} type="submit" className="w-full">
            Create Folder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
