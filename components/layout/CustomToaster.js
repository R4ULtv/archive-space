"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

// Create a custom toaster for handling the theme from next-themes
export default function CustomToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      toastOptions={{
        classNames: {
          toast: "bg-zinc-100 dark:bg-zinc-900 gap-2",
        },
      }}
    />
  );
}
