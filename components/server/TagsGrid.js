import clientPromise from "@/lib/mongodb";
import Tags from "@/components/client/Tags";

export async function TagsGrid({ tag, category }) {
  const client = await clientPromise;
  const db = client.db("production");
  const tags = await db.collection("files").aggregate([
    { $match: { category } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $project: { count: 1 } }
  ]).toArray();

  return <Tags tags={tags} tag={tag} />;
}

export function TagsGridLoading() {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-lg mx-auto">
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-16 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-10 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
    </div>
  );
}
