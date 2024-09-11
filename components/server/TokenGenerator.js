"use server";

import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export default async function TokenGenerator({ fileName, type }) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const client = await clientPromise;
  const db = client.db("production");

  // check if the file already exists
  const file = await db.collection("files").findOne({ name: fileName });
  if (file) {
    return { error: "This file already exists in the cloud." };
  }

  // insert the token into the database
  await db.collection("tokens").insertOne({
    token: token,
    file: encodeURIComponent(fileName),
    type: type,
    used: false,
    createdAt: new Date(),
  });
  
  return token;
}
