import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

// Constants
export const USAGE_CACHE_KEY = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/storage/usage`;
const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 min

export interface Usage {
  totalFiles: number;
  totalStorageBytes: number;
  freeTier: {
    limitBytes: number;
    usedBytes: number;
    remainingBytes: number;
    usagePercentage: number;
    isExceeded: boolean;
  };
  paidTier: {
    overageBytes: number;
    monthlyCost: number;
    pricePerGbMonth: number;
    isActive: boolean;
  };
  status: "ok" | "high" | "full";
}

export const useUsage = () => {
  const { data, error, isLoading } = useSWR<Usage>(
    USAGE_CACHE_KEY,
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
    usage: data && data,
    isLoading,
    error,
  };
};
