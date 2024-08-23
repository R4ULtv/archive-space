import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/lib/s3Client";

export async function uploadFile(file) {
  const buffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: file.name,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
  });

  try {
    const response = await s3Client.send(command);
    return {
      success: true,
      fileName: file.name,
      eTag: response.ETag,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
