"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function Tags({ tags, tag }) {
  const router = useRouter();
  const [filter, setFilter] = useState(tag);

  const handleSubmit = (e) => {
    if (filter === e) {
      const url = new URLSearchParams();
      router.push(`?${url.toString()}`);
      return;
    }
    const url = new URLSearchParams();
    url.set("tag", e);
    router.push(`?${url.toString()}`);
  };

  useEffect(() => {
    setFilter(tag);
  }, [tag]);

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-lg mx-auto">
      {tags.map((tag) => (
        <Button
          key={tag._id}
          onClick={() => handleSubmit(tag._id)}
          className="flex items-center gap-0.5 bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100"
        >
          {filter === tag._id && (
            <XMarkIcon className="size-3 text-zinc-900 dark:text-zinc-100" />
          )}
          {tag._id}
        </Button>
      ))}
    </div>
  );
}
