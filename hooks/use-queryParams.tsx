"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current query parameters as an object
  const getQueryParams = useCallback(() => {
    return Object.fromEntries(searchParams);
  }, [searchParams]);

  // Update specific query parameters
  const updateQueryParams = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          currentParams.set(key, value); // Add/update parameter
        } else {
          currentParams.delete(key); // Remove parameter
        }
      });

      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

  // Clear specific query parameters
  const clearQueryParams = useCallback(
    (keys: string[]) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      keys.forEach((key) => currentParams.delete(key));

      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    getQueryParams,
    updateQueryParams,
    clearQueryParams,
  };
};
