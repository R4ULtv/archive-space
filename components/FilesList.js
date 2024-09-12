import clientPromise from "@/lib/mongodb";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import DownloadButton from "@/components/client/DownloadButton";
import DeleteButton from "@/components/client/DeleteButton";
import numeral from "numeral";
import EditButton from "@/components/client/EditButton";
import getCategories from "@/utils/getCategories";

export async function FilesList({ tag, category }) {
  const client = await clientPromise;
  const db = client.db("production");

  const query = tag ? { tags: tag } : {};
  if (category) query.category = category;

  const files = await db
    .collection("files")
    .find(query)
    .sort({ uploadedAt: -1 })
    .limit(category ? 100 : 5)
    .toArray();

  const categories = await getCategories();

  return (
    <div>
      {files.map((file) => (
        <div
          key={file._id}
          className="flex justify-between gap-4 py-1 sm:py-3 px-3 -mx-3 group rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 duration-150"
        >
          <div className="flex-1">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              {file.name}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              {file.lastModified.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              ·{" "}
              {file.type.length > 24
                ? file.type.substring(0, 24) + "..."
                : file.type}{" "}
              · {numeral(file.size).format("0.0 b")}
            </p>
            <div className="gap-1 mt-2 hidden sm:flex">
              {file.tags &&
                file.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={
                      file.category !== "uncategorized"
                        ? `/${file.category}?tag=${tag}`
                        : `?tag=${tag}`
                    }
                    className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100"
                  >
                    {tag}
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <EditButton
              fileName={file.name}
              category={
                file.category.charAt(0).toUpperCase() + file.category.slice(1)
              }
              categories={categories}
              oldTags={file.tags}
            />
            <DeleteButton fileName={file.name} />
            <DownloadButton
              fileName={file.name}
              fetchURL={process.env.WORKER_URL}
            />
          </div>
        </div>
      ))}
      {!category && (
        <div className="text-sm text-center text-zinc-600 dark:text-zinc-400 tracking-wide select-none">
          ·····
        </div>
      )}
    </div>
  );
}

export function FilesListLoading() {
  return (
    <div>
      {new Array(5).fill(0).map((_, i) => (
        <div
          key={i}
          className="flex justify-between gap-4 py-1 sm:py-3 px-3 -mx-3 group rounded-md"
        >
          <div className="flex-1">
            <div className="h-5 w-80 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse"></div>
            <div className="mt-1.5 flex gap-5">
              <div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-md animate-pulse"></div>
              <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded-md animate-pulse"></div>
              <div className="h-3 w-12 bg-zinc-300 dark:bg-zinc-700 rounded-md animate-pulse"></div>
            </div>
            <div className="mt-3 flex gap-1">
              <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 opacity-75">
            <div className="p-1.5">
              <PencilSquareIcon className="size-4 text-zinc-900 dark:text-zinc-100 animate-pulse" />
            </div>
            <div className="p-1.5">
              <TrashIcon className="size-4 text-zinc-900 dark:text-zinc-100 animate-pulse" />
            </div>
            <div className="p-1.5">
              <ArrowDownTrayIcon className="size-4 text-zinc-900 dark:text-zinc-100 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
