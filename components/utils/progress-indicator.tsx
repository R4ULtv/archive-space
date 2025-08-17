import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

export const ProgressIndicator = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) => {
  if (progress === 100) {
    return (
      <div className="rounded-full flex items-center justify-center p-[3px] bg-foreground size-4 ml-auto">
        <ArrowUpIcon className="size-full text-background" />
      </div>
    );
  }
  return (
    <svg
      className={cn(
        "size-4 -rotate-90 text-foreground ml-auto",
        progress === 0 && "animate-spin",
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      ></circle>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="62.83"
        strokeDashoffset={
          62.83 - (progress === 0 ? 0.25 : progress / 100) * 62.83
        }
        strokeLinecap="round"
        className="transition-all duration-300 ease-in"
      ></circle>
    </svg>
  );
};
