import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import FileList from "@/components/file-list";
import FileListSkeleton from "@/components/file-list-skeleton";

import CategoryFilter, {
  CategoryFilterSkeleton,
} from "@/components/navigation/category";
import Search, { SearchSkeleton } from "@/components/navigation/search";
import StorageUsage from "@/components/navigation/usage";

import SignOut from "@/components/sign-out";
import ThemeSwitch from "@/components/theme-switch";
import UploadFiles from "@/components/upload-files";

import { getSession } from "@/lib/auth-client";

export default async function HomePage() {
  const session = await getSession();

  if (!session.data) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-3xl py-8 md:py-16 px-2 md:px-6 mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex gap-2 items-start">
          <Link
            href="/"
            className="text-base inline-block font-medium no-underline font-mono"
          >
            ARCHIVE SPACE
          </Link>
        </div>
        <div className="shrink-0">
          <ThemeSwitch />
          <SignOut />
        </div>
      </header>
      <main className="space-y-4 md:space-y-8 mt-4 md:mt-8">
        <UploadFiles />
        <div className="flex items-center gap-2">
          <StorageUsage />
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
          <Suspense fallback={<CategoryFilterSkeleton />}>
            <CategoryFilter />
          </Suspense>
        </div>
        <Suspense fallback={<FileListSkeleton count={8} />}>
          <FileList />
        </Suspense>
      </main>
    </div>
  );
}
