"use client";

import { Button } from "@/components/ui/button";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type LayoutType = "grid" | "list";

export default function LayoutFilter() {
  const [layout, setLayout] = useState<LayoutType>("list");

  useEffect(() => {
    const savedLayout = localStorage.getItem("layout");
    if (savedLayout === "grid" || savedLayout === "list") {
      setLayout(savedLayout);
    }
  }, []);

  const toggleLayout = useCallback(() => {
    setLayout((prev) => {
      const newLayout = prev === "grid" ? "list" : "grid";
      localStorage.setItem("layout", newLayout);
      return newLayout;
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
      <LayoutListIcon
        size={16}
        aria-hidden="true"
        className={`absolute transition-[scale,opacity] duration-200 ease-out group-hover:scale-110 ${
          isGrid ? "opacity-100" : "opacity-0"
        }`}
      />
      <LayoutGridIcon
        size={16}
        aria-hidden="true"
        className={`absolute transition-[scale,opacity] duration-200 ease-out group-hover:scale-110 ${
          isGrid ? "opacity-0" : "opacity-100"
        }`}
      />
    </Button>
  );
}
