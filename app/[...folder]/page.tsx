import { Metadata } from "next";
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

import { LogoIcon } from "@/components/icons";
import NewFolder from "@/components/new-folder";
import SignOut from "@/components/sign-out";
import ThemeSwitch from "@/components/theme-switch";
import UploadFiles from "@/components/upload-files";

import { getSession } from "@/lib/auth-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ folder: string[] }>;
}): Promise<Metadata> {
  const folderParams = (await params).folder;

  return {
    title:
      folderParams[folderParams.length - 1].charAt(0).toUpperCase() +
      folderParams[folderParams.length - 1].slice(1),
  };
}

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folder: string[] }>;
}) {
  const folderParams = (await params).folder;
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-3xl py-8 md:py-16 px-3 md:px-6 mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex gap-1.5 items-center">
          <Link
            href="/"
            className="text-base flex items-center gap-2 font-medium"
          >
            <LogoIcon /> Archive Space
          </Link>
        </div>
        <div className="shrink-0">
          <ThemeSwitch />
          <SignOut />
        </div>
      </header>
      <main className="space-y-4 md:space-y-8 mt-4 md:mt-8">
        <UploadFiles basePath={folderParams.join("/")} />
        <div className="flex items-center gap-2">
          <StorageUsage />
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
          <Suspense fallback={<CategoryFilterSkeleton />}>
            <CategoryFilter />
          </Suspense>
          <NewFolder basePath={folderParams.join("/")} />
        </div>
        <Suspense fallback={<FileListSkeleton count={8} />}>
          <FileList basePath={folderParams.join("/")} />
        </Suspense>
      </main>
    </div>
  );
}
