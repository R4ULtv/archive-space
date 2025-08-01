"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategoryFilter } from "@/hooks/use-category-filters";
import { fileTypeCategoryList } from "@/lib/mime-type";
import { cn } from "@/lib/utils";
import { ListFilterIcon, XIcon } from "lucide-react";

const categoryOptions = fileTypeCategoryList.map((category) => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));

export default function CategoryFilter() {
  const { categories, clearCategories, hasCategory, toggleCategory } =
    useCategoryFilter();

  const hasActiveFilters = categories && categories.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Category filters"
          className="relative"
        >
          <ListFilterIcon size={16} aria-hidden="true" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full border border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-3" align="end" sideOffset={6}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">
              Filters
            </span>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "text-muted-foreground/80 hover:text-foreground size-4 hover:bg-transparent dark:hover:bg-transparent opacity-0",
                hasActiveFilters && "opacity-100",
              )}
              onClick={clearCategories}
              aria-label="Clear filters"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-3">
            {categoryOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={value}
                  checked={hasCategory(value)}
                  onCheckedChange={() => toggleCategory(value)}
                />
                <Label htmlFor={value} className="font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CategoryFilterSkeleton() {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Category filters"
      className="hover:bg-accent/50"
    >
      <ListFilterIcon size={16} aria-hidden="true" />
    </Button>
  );
}
