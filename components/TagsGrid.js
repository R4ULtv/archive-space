import clientPromise from "@/lib/mongodb";
import Tags from "./Tags";

export async function TagsGrid({ tag, category }) {
  const client = await clientPromise;
  const db = client.db("production");
  const tags = await db.collection("files").distinct("tags", { category });

  return <Tags tags={tags} tag={tag} />;
}

export function TagsGridLoading() {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-16 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
    </div>
  );
}
