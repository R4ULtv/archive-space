"use server";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export default async function EditFile(fileName, category, tags) {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const client = await clientPromise;
  const db = client.db("production");
  const file = await db.collection("files").findOne({ name: fileName });

  if (!file) {
    return {
      error: "Cannot find file to edit.",
    };
  }

  const edit = await db
    .collection("files")
    .updateOne({ name: fileName }, { $set: { category, tags } });

  if (!edit) {
    return {
      error: "The file was not edited successfully.",
    };
  }

  return {
    success: true,
  };
}
