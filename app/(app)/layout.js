import ThemeChanger from "@/components/layout/ThemeChanger";
import SignOutButton from "@/components/SignOutButton";
import getCategories from "@/utils/getCategories";
import Link from "next/link";

export default function AppLayout({ children }) {
  return (
    <>
      <header className="mb-16 flex items-start justify-between">
        <div className="flex flex-col items-start">
          <span className="text-base inline-block font-medium no-underline text-zinc-800 dark:text-zinc-200">
            Archive Space
          </span>
          <CategoryList />
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

async function CategoryList() {
  const categories = await getCategories();

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Link
        href={`/`}
        className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100"
      >
        Home
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/${category.toLowerCase()}`}
          className="bg-zinc-300 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs text-zinc-900 dark:text-zinc-100"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
