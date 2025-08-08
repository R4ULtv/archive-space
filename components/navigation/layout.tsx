"use client";

import { Button } from "@/components/ui/button";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import { useCallback, useState } from "react";

type LayoutType = "grid" | "list";

export default function LayoutFilter() {
  const [layout, setLayout] = useState<LayoutType>("list");

  const toggleLayout = useCallback(() => {
    setLayout((prev) => {
      return prev === "grid" ? "list" : "grid";
    });
  }, []);

  const isGrid = layout === "grid";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Switch to ${isGrid ? "list" : "grid"} view`}
      className="group hover:bg-accent/50"
      onClick={toggleLayout}
    >
      <ListIcon
        size={16}
        aria-hidden="true"
        className={`absolute group-hover:scale-110 transition-[scale,opacity] duration-200 ease-out ${
          isGrid ? "opacity-100" : "opacity-0"
        }`}
      />
      <LayoutGridIcon
        size={16}
        aria-hidden="true"
        className={`absolute group-hover:scale-110 transition-[scale,opacity] duration-200 ease-out\ ${
          isGrid ? "opacity-0" : "opacity-100"
        }`}
      />
    </Button>
  );
}
