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

  // insert the token into the database
  await db.collection("tokens").insertOne({
    token: token,
    file: fileName,
    type: type,
    used: false,
    createdAt: new Date(),
  });
  
  return token;
}
