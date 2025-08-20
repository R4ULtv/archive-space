import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

// Constants
export const FILES_CACHE_KEY = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/storage`;
export const OBJECTS_CACHE_KEY = `${FILES_CACHE_KEY}/objects`;
const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 min

// Types
export interface StorageObject {
  key: string;
  size: number;
  etag: string;
  uploaded: string;
  httpEtag: string;
}

export interface Storage {
  objects: StorageObject[];
  folders: string[];
}

// Helper function to construct URL
const buildStorageUrl = (folder?: string): string => {
  if (!OBJECTS_CACHE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_AUTH_API_URL environment variable is not configured",
    );
  }

  return folder ? `${OBJECTS_CACHE_KEY}/${folder}/` : OBJECTS_CACHE_KEY;
};

// Main hook
export const useFiles = ({ folder }: { folder?: string } = {}) => {
  const { data, error, isLoading } = useSWR<Storage>(
    buildStorageUrl(folder),
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: REFRESH_INTERVAL,
      errorRetryCount: 3,
      focusThrottleInterval: 30000,
      fallbackData: undefined,
      shouldRetryOnError: (error) => {
        return error?.status >= 500 || !error?.status;
      },
    },
  );

  return {
    files: data?.objects,
    folders: data?.folders,
    isLoading,
    error,
  };
};
