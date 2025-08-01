import useSWR from "swr";
import { fetcher } from "./fetcher";

export const FILES_CACHE_KEY = "https://auth.raulcarini.dev/api/storage";

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
    },
  );

  return {
    files: data,
    isLoading,
    error,
  };
};
