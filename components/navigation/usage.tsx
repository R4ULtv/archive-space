"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/hooks/use-file-upload";
import { useFiles } from "@/lib/use-files";

const MAX_STORAGE = 10 * 1024 * 1024 * 1024; // Free plan limit 10GB
const PRICE_PER_GB_MONTH = 0.015; // $0.015 per GB per month

export default function StorageUsage() {
  const { files, isLoading, error } = useFiles();

  if (error) return null;
  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Usage"
        className="hover:bg-accent/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-rotate-90 animate-spin"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" />
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeDasharray="62.83"
            strokeDashoffset="50"
            strokeLinecap="round"
            className="transition-all duration-300 ease-in"
          />
        </svg>
      </Button>
    );
  }
  if (!files) return null;

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const usedPercentage = Math.min((totalSize / MAX_STORAGE) * 100, 100);

  let monthlyCost = 0;
  if (totalSize > MAX_STORAGE) {
    const excessBytes = totalSize - MAX_STORAGE;
    const excessGB = excessBytes / (1024 * 1024 * 1024);
    monthlyCost = excessGB * PRICE_PER_GB_MONTH;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Usage"
          className="hover:bg-accent/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-rotate-90"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" />
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeDasharray="62.83"
              strokeDashoffset={62.83 - (usedPercentage / 100) * 62.83}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start" sideOffset={6}>
        <div className="space-y-1.5">
          <div className="text-muted-foreground text-xs font-medium">Usage</div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-2 text-[13px] text-muted-foreground">
              <span>
                {formatBytes(totalSize)} · {usedPercentage.toFixed(2)}%
              </span>
              <span>{formatBytes(MAX_STORAGE)}</span>
            </div>
            <Progress value={usedPercentage} />
          </div>

          {totalSize > MAX_STORAGE && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-xs font-medium text-destructive">
                Additional monthly cost: ${monthlyCost.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
