"use server";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export default async function saveFile({ name, type, size, lastModified }) {
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const client = await clientPromise;
  const db = client.db("production");
  const fileRecord = await db.collection("files").insertOne({
    name: name,
    type: type,
    size: size,
    category: "uncategorized",
    tags: [],
    lastModified: new Date(parseInt(lastModified)),
    uploadedAt: new Date(),
  });

  if (!fileRecord) {
    return { message: "Record not inserted" };
  }
  return {
    message: "File uploaded successfully",
  };
}
