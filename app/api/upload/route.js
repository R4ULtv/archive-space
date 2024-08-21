import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { uploadFile } from "@/components/server/UploadFile";

export const POST = auth(async function POST(request) {
  if (!request.auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const lastModified = formData.get("lastModified");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const result = await uploadFile(file);

    if (result.success) {
      const client = await clientPromise;
      const db = client.db("tests");
      const fileRecord = await db.collection("files").insertOne({
        name: file.name,
        type: file.type,
        size: file.size,
        category: "Uncategorized",
        tags: [],
        lastModified: new Date(parseInt(lastModified)),
        uploadedAt: new Date(file.lastModified),
      });

      if (!fileRecord) {
        return NextResponse.json(
          { message: "Record not inserted" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        message: "File uploaded successfully",
        fileName: result.fileName,
      });
    } else {
      return NextResponse.json(
        { message: "File upload failed", error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
});
