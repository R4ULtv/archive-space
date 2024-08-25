"use client";

import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import numeral from "numeral";
import Link from "next/link";

import SearchFiles from "@/components/server/SearchFiles";
import LoadingCircle from "@/components/LoadingCircle";
import DeleteButton from "@/components/client/DeleteButton";
import DownloadButton from "@/components/client/DownloadButton";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [query] = useDebounce(inputValue, 200);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    handleSearch();
    saveRecentSearch(query);
  }, [query]);

  const handleSearch = async () => {
    if (query.length < 1) return setData([]);
    setIsLoading(true);
    try {
      const res = await SearchFiles(query);
      setData(res);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (searchText) => {
    if (searchText.length < 1) return;

    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    const updatedSearches = [
      searchText,
      ...recentSearches.filter((s) => s !== searchText),
    ].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleChanges = (value) => {
    if (
      value &&
      data.length === 0 &&
      query.length === 0 &&
      recentSearches.length > 0 &&
      inputValue.length === 0
    ) {
      setInputValue(value);
    } else {
      setSelectedOption(value);
    }
  };

  return (
    <>
      <Combobox immediate value={selectedOption} onChange={handleChanges}>
        <div className="relative w-full">
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 placeholder-zinc-500 duration-75 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-200/25 dark:hover:bg-zinc-800/25">
            <ComboboxButton>
              <MagnifyingGlassIcon className="size-4 text-zinc-600 dark:text-zinc-400 ml-2" />
            </ComboboxButton>

            <ComboboxInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search files..."
              autoComplete="off"
              className="w-full p-2 text-sm bg-transparent font-semibold text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none"
            />
            {isLoading ? (
              <LoadingCircle className="mr-2 size-4 text-zinc-600 dark:text-zinc-400" />
            ) : (
              inputValue.length > 0 && (
                <XMarkIcon
                  onClick={() => setInputValue("")}
                  className="size-4 text-zinc-600 dark:text-zinc-400 mr-2 cursor-pointer"
                />
              )
            )}
          </div>

          <ComboboxOptions className="group absolute left-0 w-full z-10 space-y-2 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mt-1 shadow">
            {data.length === 0 &&
            query.length === 0 &&
            recentSearches.length > 0 ? (
              recentSearches.map((item) => (
                <ComboboxOption
                  key={item}
                  value={item}
                  className="p-2 data-[focus]:bg-zinc-200 data-[focus]:dark:bg-zinc-800 first:rounded-t-md last:rounded-b-md text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between"
                >
                  {item}
                  <ArrowRightCircleIcon className="size-3.5 text-zinc-600 dark:text-zinc-400" />
                </ComboboxOption>
              ))
            ) : data.length === 0 && query.length > 0 ? (
              <div className="p-2 text-sm text-zinc-600 dark:text-zinc-400">
                No results found.
              </div>
            ) : (
              data.map((item) => (
                <ComboboxOption
                  key={item.name}
                  value={item}
                  className="p-2 data-[focus]:bg-zinc-200 data-[focus]:dark:bg-zinc-800 first:rounded-t-md last:rounded-b-md text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between"
                >
                  {item.name}
                  <ArrowTopRightOnSquareIcon className="size-3.5 text-zinc-600 dark:text-zinc-400" />
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
      {selectedOption && (
        <Dialog
          open={selectedOption !== null}
          onClose={() => setSelectedOption(null)}
          className="relative z-40"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition duration-150 ease-in-out data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full flex justify-between gap-4 max-w-xl border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
            >
              <div className="flex-1">
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedOption.name}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {selectedOption.lastModified.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  ·{" "}
                  {selectedOption.type.length > 24
                    ? selectedOption.type.substring(0, 24) + "..."
                    : selectedOption.type}{" "}
                  · {numeral(selectedOption.size).format("0.0 b")}
                </p>
                <div className="flex gap-1 mt-2">
                  {selectedOption.tags &&
                    selectedOption.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`?tag=${tag}`}
                        className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100"
                      >
                        {tag}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <DeleteButton fileName={selectedOption.name} />
                <DownloadButton fileName={selectedOption.name} />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default SearchBar;
