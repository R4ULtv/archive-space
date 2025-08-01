"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

export default function Search() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    [setSearch],
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch],
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex-1">
      <Input
        ref={inputRef}
        className="peer ps-9 pe-11 dark:bg-input/30 hover:dark:bg-accent/50 transition-colors"
        placeholder="Search..."
        autoComplete="off"
        value={search}
        onChange={handleChange}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
        <kbd className="text-muted-foreground inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

export const SearchSkeleton = () => {
  return (
    <div className="relative flex-1">
      <Input
        className="peer ps-9 pe-11 dark:bg-background hover:dark:bg-accent/50 transition-colors"
        placeholder="Search..."
        autoComplete="off"
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
        <kbd className="text-muted-foreground bg-background inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};
