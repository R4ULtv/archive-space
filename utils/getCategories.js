"use server";
import clientPromise from "@/lib/mongodb";

export default async function getCategories({ formatted = true }) {
  const client = await clientPromise;
  const db = client.db("production");
  const categories = await db.collection("files").distinct("category");

  if (formatted) {
    const formattedCategories = categories.map(
      (category) => category.charAt(0).toUpperCase() + category.slice(1)
    );
    return formattedCategories;
  }
  return categories;
}
