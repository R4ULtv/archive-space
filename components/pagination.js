import clientPromise from "@/lib/mongodb";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";

export async function Pagination({ category, searchParams }) {
  const query = searchParams.tag ? { tags: searchParams.tag } : {};
  query.category = category;

  const client = await clientPromise;
  const db = client.db("production");
  const totalFiles = await db.collection("files").countDocuments(query);
  const totalPages = Math.ceil(totalFiles / 20);

  return (
    <Navigation
      category={category}
      currentPage={searchParams?.page ? parseInt(searchParams.page) : 1}
      totalUsers={totalFiles}
      totalPages={totalPages}
      searchParams={searchParams}
    />
  );
}

export function Navigation({
  category,
  currentPage,
  totalPages,
  totalUsers,
  searchParams,
}) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const firstPage = new URLSearchParams(searchParams);
  firstPage.set("page", 1);

  const lastPage = new URLSearchParams(searchParams);
  lastPage.set("page", totalPages);

  const previusUrl = new URLSearchParams(searchParams);
  if (currentPage > 1) {
    previusUrl.set("page", currentPage - 1);
  }

  const nextUrl = new URLSearchParams(searchParams);
  if (currentPage < totalPages) {
    nextUrl.set("page", currentPage + 1);
  }

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing{" "}
          <span className="font-medium">
            {currentPage * 20 - 19}-
            {currentPage == totalPages ? totalUsers : currentPage * 20}
          </span>{" "}
          of <span className="font-medium">{totalUsers}</span>
        </p>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Link
            href={
              currentPage == 1
                ? `${category}`
                : `${category}/?${firstPage.toString()}`
            }
            className="relative rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">First</span>
            <ChevronDoubleLeftIcon className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href={
              currentPage == 1 ? `` : `${category}/?${previusUrl.toString()}`
            }
            className="relative rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href={
              currentPage == totalPages
                ? ``
                : `${category}/?${nextUrl.toString()}`
            }
            className="relative rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 outline-offset-0"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href={
              currentPage == totalPages
                ? ``
                : `${category}/?${lastPage.toString()}`
            }
            className="relative rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 outline-offset-0"
          >
            <span className="sr-only">Last</span>
            <ChevronDoubleRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
