"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryGrid({ categories }) {
  const currentPath = usePathname();

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Link
        href={`/`}
        className={
          "bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100 " +
          (currentPath === "/" ? "font-semibold" : "opacity-90")
        }
      >
        Home
      </Link>

      {categories.map((category) => (
        <Link
          key={category}
          href={`/${category.toLowerCase()}`}
          className={
            "bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100 " +
            (currentPath === "/" + category.toLowerCase()
              ? "font-semibold"
              : "opacity-90")
          }
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
