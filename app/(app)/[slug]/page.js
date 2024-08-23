import { notFound } from "next/navigation";
import { Suspense } from "react";

import SearchBar from "@/components/client/SearchBar";
import { FilesList, FilesListLoading } from "@/components/FilesList";
import { TagsGrid, TagsGridLoading } from "@/components/TagsGrid";
import getCategories from "@/utils/getCategories";

export async function generateStaticParams() {
  const categories = await getCategories(false);

  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function Blog({ params, searchParams }) {
  const category = await getCategories(false);

  if (!category.includes(params.slug)) {
    notFound();
  }
  return (
    <div className="space-y-4 mt-4">
      <SearchBar />
      <Suspense fallback={<TagsGridLoading />}>
        <TagsGrid tag={searchParams.tag} category={params.slug} />
      </Suspense>
      <Suspense fallback={<FilesListLoading />}>
        <FilesList tag={searchParams.tag} category={params.slug} />
      </Suspense>
    </div>
  );
}
