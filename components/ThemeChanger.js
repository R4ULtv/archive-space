"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [theme, setTheme]);


  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className="flex justify-center items-center cursor-pointer group duration-150 text-gray-800 dark:text-gray-200 p-2"
    >
      {theme === "light" ? (
        <SunIcon className="size-4 group-hover:scale-110 duration-150" />
      ) : (
        <MoonIcon className="size-4 group-hover:scale-110 duration-150" />
      )}
    </button>
  );
}
