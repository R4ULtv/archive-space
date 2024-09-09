"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { auth } from "@/lib/auth";
import s3Client from "@/lib/s3Client";
import clientPromise from "@/lib/mongodb";

export async function DeleteFile(fileName) {
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: encodeURIComponent(fileName),
  });

  try {
    const response = await s3Client.send(command);
    if (!response) {
      return { error: "The file was not deleted successfully." };
    }

    const client = await clientPromise;
    const db = client.db("production");
    const result = await db.collection("files").deleteOne({ name: fileName });

    if (result.deletedCount === 0) {
      return {
        error: "The record in the database was not deleted successfully.",
      };
    }
    return { message: "File deleted successfully" };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
