"use client";

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Input,
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import EditFile from "@/components/server/EditFile";
import LoadingCircle from "@/components/LoadingCircle";

export default function EditButton({
  fileName,
  category,
  categories,
  oldTags,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState(oldTags || []);

  // Filter categories based on query input
  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((cat) =>
          cat.toLowerCase().includes(query.toLowerCase())
        );

  const handleCategoryChange = (value) => {
    if (!categories.includes(value)) {
      setSelectedCategory(value);
    } else {
      setSelectedCategory(value);
    }
  };

  const onSubmitSave = async (e) => {
    setIsOpen(false);
    setLoading(true);

    const file = await EditFile(fileName, selectedCategory.toLowerCase(), tags);
    if (file) {
      setLoading(false);
      if (file.error) {
        toast.error("Something went wrong.", {
          description: file.error,
        });
      }
      router.refresh();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle key events for tag input
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      setInputValue(tags[tags.length - 1]);
      setTags(tags.slice(0, -1));
      e.preventDefault();
    }

    if (
      (e.key === "Enter" ||
        e.key === " " ||
        e.key === "Tab" ||
        e.key === ",") &&
      inputValue.trim() &&
      tags.length < 7
    ) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
      e.preventDefault();
    } else if (e.key === "Enter" && inputValue.trim() && tags.length === 7) {
      setInputValue("");
    }
  };

  // Remove a tag by index
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <Button
        disabled={loading}
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
      >
        {loading ? (
          <LoadingCircle className="size-4 text-zinc-700 dark:text-zinc-300" />
        ) : (
          <PencilSquareIcon className="size-4 text-zinc-700 dark:text-zinc-300" />
        )}
      </Button>

      <Dialog
        transition
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition duration-150 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
          >
            <DialogTitle className="font-bold">Edit Files</DialogTitle>
            <Description className="text-sm text-zinc-600 dark:text-zinc-400">
              Make changes to the file: {fileName}
            </Description>

            <div className="mt-2">
              <p>Category:</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                You can change the category of this file or create a new one.
              </p>
              <Combobox
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <div className="relative mt-1">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <ComboboxInput
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 focus:ring-0 outline-none"
                      displayValue={(category) => category}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
                        aria-hidden="true"
                      />
                    </ComboboxButton>
                  </div>
                  <ComboboxOptions className="group absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-zinc-200 dark:bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCategories.length === 0 && query !== "" ? (
                      <ComboboxOption
                        value={query}
                        className="relative cursor-default select-none py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100"
                      >
                        Create "{query}"
                      </ComboboxOption>
                    ) : (
                      filteredCategories.map((category) => (
                        <ComboboxOption
                          key={category}
                          value={category}
                          className="relative cursor-default select-none py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 data-[focus]:bg-zinc-300 data-[focus]:dark:bg-zinc-700 data-[focus]:text-zinc-900 group-data-[selected]:dark:text-zinc-100"
                        >
                          <>
                            <span className="block truncate">{category}</span>
                            <span className="invisible absolute inset-y-0 left-0 flex items-center pl-2 group-data-[selected]:visible">
                              <CheckIcon
                                className="size-4"
                                aria-hidden="true"
                              />
                            </span>
                          </>
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </div>
              </Combobox>
            </div>

            <div className="mt-2">
              <p>Tags:</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Tags can be used to find files more quickly and easily.
              </p>
              <div className="relative mt-1.5">
                <div className="flex flex-wrap gap-2 p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg min-h-[40px] ">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                      >
                        <XMarkIcon className="size-3" />
                      </button>
                    </span>
                  ))}
                  <Input
                    type="text"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      tags.length < 7 ? "Add tags" : "Max tags reached (7)"
                    }
                    maxLength={16}
                    inputMode="text"
                    aria-label="Add tags"
                    className="min-w-24 w-min flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 font-semibold mt-3">
              <Button
                onClick={() => setIsOpen(false)}
                className="border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSubmitSave()}
                className="bg-zinc-300 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300/50 hover:dark:bg-zinc-700/50"
              >
                Save
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
