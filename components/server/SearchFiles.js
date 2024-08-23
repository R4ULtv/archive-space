"use server";
import clientPromise from "@/lib/mongodb";

export default async function SearchFiles(query) {
  const client = await clientPromise;
  const db = client.db("production");
  const files = await db
    .collection("files")
    .aggregate([
      {
        $search: {
          index: "default",
          autocomplete: {
            query: query,
            path: "name",
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $limit: 5,
      },
    ])
    .toArray();

  return files;
}
