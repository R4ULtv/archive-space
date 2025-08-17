import { Skeleton } from "@/components/ui/skeleton";

interface FileListSkeletonProps {
  count?: number;
}

export default function FileListSkeleton({ count = 5 }: FileListSkeletonProps) {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* File icon skeleton */}
            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
              <Skeleton className="h-5 w-5" />
            </div>
            {/* File info skeleton */}
            <div className="flex min-w-0 flex-col gap-0.5">
              {/* File name skeleton - varying widths for realism */}
              <Skeleton
                className="h-[13px]"
                style={{
                  width: `${120 + ((index * 30) % 80)}px`,
                }}
              />
              {/* File info skeleton - date · type · size */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-16" />
                <span className="text-muted-foreground text-xs">·</span>
                <Skeleton className="h-3 w-8" />
                <span className="text-muted-foreground text-xs">·</span>
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="size-8 flex items-center justify-center">
              <Skeleton className="size-4 rounded-lg" />
            </div>
            <div className="size-8 flex items-center justify-center">
              <Skeleton className="size-4 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
