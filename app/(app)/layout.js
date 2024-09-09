import { Suspense } from "react";

import CategoryGrid from "@/components/client/CategoryGrid";
import ThemeChanger from "@/components/layout/ThemeChanger";
import SignOutButton from "@/components/SignOutButton";
import getCategories from "@/utils/getCategories";

export default function AppLayout({ children }) {
  return (
    <>
      <header className="mb-16 flex items-start justify-between">
        <div className="flex flex-col items-start">
          <span className="text-base inline-block font-medium no-underline text-zinc-800 dark:text-zinc-200">
            Archive Space
          </span>
          <Suspense fallback={<CategoriesLoading />}>
            <Categories />
          </Suspense>
        </div>
        <div>
          <ThemeChanger />
          <SignOutButton />
        </div>
      </header>

      {children}
    </>
  );
}

async function Categories() {
  const categories = await getCategories();

  return <CategoryGrid categories={categories} />;
}

function CategoriesLoading() {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100">
        Home
      </div>
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
    </div>
  );
}
