import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export const FILES_CACHE_KEY = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/storage`;

export interface StorageObject {
  key: string;
  size: number;
  etag: string;
  uploaded: string;
  httpEtag: string;
}

export const useFiles = () => {
  const { data, error, isLoading } = useSWR<StorageObject[]>(
    FILES_CACHE_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 120000, // 2 minutes
    },
  );

  return {
    files: data,
    isLoading,
    error,
  };
};
