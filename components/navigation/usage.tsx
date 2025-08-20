"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/hooks/use-file-upload";
import { useUsage } from "@/lib/use-usage";

export default function StorageUsage() {
  const { usage, isLoading, error } = useUsage();

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
  if (!usage) return null;

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
              strokeDashoffset={
                62.83 - (usage.freeTier.usagePercentage / 100) * 62.83
              }
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
                {formatBytes(usage.totalStorageBytes)} ·{" "}
                {usage.freeTier.usagePercentage}%
              </span>
              <span>{formatBytes(usage.freeTier.limitBytes)}</span>
            </div>
            <Progress value={usage.freeTier.usagePercentage} />
          </div>

          {usage.totalStorageBytes > usage.freeTier.limitBytes && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-xs font-medium text-destructive">
                Additional monthly cost: ${usage.paidTier.monthlyCost}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
