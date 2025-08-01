"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useCategoryFilter } from "@/hooks/use-category-filters";
import { fileTypeCategoryList } from "@/lib/mime-type";
import { ListFilterIcon, XIcon } from "lucide-react";
import * as React from "react";

const categoryOptions = fileTypeCategoryList.map((category) => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));

export default function CategoryFilter() {
  const [open, setOpen] = React.useState(false);
  const { categories, clearCategories, hasCategory, toggleCategory } =
    useCategoryFilter();
  const hasActiveFilters = categories && categories.length > 0;

  const handleClearFilters = React.useCallback(() => {
    clearCategories();
    setOpen(false);
  }, [clearCategories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          <div className="text-muted-foreground text-xs font-medium">
            Filters
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
          {hasActiveFilters && (
            <>
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full h-8"
              >
                <XIcon aria-hidden="true" /> Clear Filters
              </Button>
            </>
          )}
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
