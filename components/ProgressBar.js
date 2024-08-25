import clientPromise from "@/lib/mongodb";
import numeral from "numeral";

export async function ProgressBar() {
  const client = await clientPromise;
  const db = client.db("production");
  const totalBytes = await db
    .collection("files")
    .aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$size" },
        },
      },
    ])
    .toArray();
  const totalSize = totalBytes[0]?.totalSize || 0;
  const maxSize = 5e9; // Max 5GB on Cloudflare R2 free plan
  const progress = (totalSize / maxSize) * 100;

  return (
    <div>
      <div className="bg-zinc-300 dark:bg-zinc-700 w-full h-2 rounded-full relative mb-1">
        <div
          className="bg-zinc-500 h-2 rounded-full"
          style={{ width: (progress < 1 ? 1 : progress) + "%" }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-800 dark:text-zinc-200">
        <p>
          {numeral(totalSize).format("0.00 b")} ·{" "}
          {numeral(progress / 100).format("0.00 %")}
        </p>
        <span>{numeral(maxSize).format("0.00 b")}</span>
      </div>
    </div>
  );
}

export function LoadingProgressBar() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-300 dark:bg-zinc-700 w-full h-2 rounded-full relative mb-2">
        <div className="bg-zinc-500 w-1/3 h-2 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-800 dark:text-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-14 h-4 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
          ·
          <div className="w-14 h-4 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
        </div>

        <div className="w-14 h-4 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
