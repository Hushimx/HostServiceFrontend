"use client";

import { useRouter } from "next/router";

const useQueryParams = () => {
  const router = useRouter();

  // Get the current query parameters as an object
  const getQueryParams = () => {
    return { ...router.query };
  };

  // Set or update a query parameter without refreshing
  const setQueryParam = (key, value) => {
    const newQuery = { ...router.query, [key]: value };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  // Remove a query parameter without refreshing
  const removeQueryParam = (key) => {
    const newQuery = { ...router.query };
    delete newQuery[key];
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  // Clear all query parameters without refreshing
  const clearQueryParams = () => {
    router.push({ pathname: router.pathname }, undefined, { shallow: true });
  };

  return {
    getQueryParams,
    setQueryParam,
    removeQueryParam,
    clearQueryParams,
  };
};

export default useQueryParams;
