import { parseAsArrayOf, parseAsStringEnum, useQueryState } from "nuqs";
import { FileTypeCategory, fileTypeCategoryList } from "@/lib/mime-type";
import { useCallback, useMemo } from "react";

export function useCategoryFilter() {
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsStringEnum<FileTypeCategory>(fileTypeCategoryList)),
  );

  // Memoize the categories set for O(1) lookups
  const categoriesSet = useMemo(() => new Set(categories || []), [categories]);

  // Function to check if a category is selected
  const hasCategory = useCallback(
    (category: FileTypeCategory) => categoriesSet.has(category),
    [categoriesSet],
  );

  // Function to toggle a category
  const toggleCategory = useCallback(
    (category: FileTypeCategory) => {
      if (categoriesSet.has(category)) {
        const updatedCategories = categories?.filter((c) => c !== category);
        setCategories(
          updatedCategories?.length === 0 ? null : (updatedCategories ?? null),
        );
      } else {
        setCategories([...(categories ?? []), category]);
      }
    },
    [categories, setCategories, categoriesSet],
  );

  // Function to add a category
  const addCategory = useCallback(
    (category: FileTypeCategory) => {
      if (!categoriesSet.has(category)) {
        setCategories([...(categories ?? []), category]);
      }
    },
    [categories, setCategories, categoriesSet],
  );

  // Function to remove a category
  const removeCategory = useCallback(
    (category: FileTypeCategory) => {
      if (categoriesSet.has(category)) {
        const updatedCategories = categories?.filter((c) => c !== category);
        setCategories(
          updatedCategories?.length === 0 ? null : (updatedCategories ?? null),
        );
      }
    },
    [categories, setCategories, categoriesSet],
  );

  // Function to clear all categories
  const clearCategories = useCallback(() => {
    setCategories(null);
  }, [setCategories]);

  // Function to set multiple categories at once
  const setMultipleCategories = useCallback(
    (newCategories: FileTypeCategory[]) => {
      setCategories(newCategories.length === 0 ? null : newCategories);
    },
    [setCategories],
  );

  return {
    categories,
    setCategories,
    categoriesSet,
    hasCategory,
    toggleCategory,
    addCategory,
    removeCategory,
    clearCategories,
    setMultipleCategories,
  };
}
