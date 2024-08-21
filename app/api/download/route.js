import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { downloadFile } from "@/components/server/DownloadFile";

export const GET = auth(async function GET(request) {
  if (!request.auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return NextResponse.json(
      { message: "File name is required" },
      { status: 400 }
    );
  }

  const {
    fileBuffer,
    contentType,
    fileName: name,
    error,
  } = await downloadFile(fileName);

  if (error) {
    if (error.Code === "NoSuchKey") {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }

  // Create response with appropriate headers
  const response = new NextResponse(fileBuffer);
  response.headers.set("Content-Disposition", `attachment; filename=${name}`);
  response.headers.set("Content-Type", contentType);

  return response;
});
