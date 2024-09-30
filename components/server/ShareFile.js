"use server";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export default async function ShareFile(fileName) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const client = await clientPromise;
    const db = client.db("production");
    const filesCollection = db.collection("files");

    const file = await filesCollection.findOne(
      { name: fileName },
      { projection: { public: 1 } }
    );
    if (!file) {
      throw new Error("File not found");
    }

    const result = await filesCollection.updateOne(
      { name: fileName },
      { $set: { public: !file.public } }
    );

    if (result.modifiedCount !== 1) {
      throw new Error("Failed to update file");
    }

    return { success: true };
  } catch (error) {
    console.error("ShareFile error:", error);
    return { error: error.message };
  }
}
