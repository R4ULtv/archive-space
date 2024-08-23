import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/lib/s3Client";

export async function downloadFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  });

  try {
    const response = await s3Client.send(command);

    // The file content is available in the response.Body
    // It's a ReadableStream, which we'll convert to a Buffer
    const fileBuffer = await streamToBuffer(response.Body);

    return {
      fileBuffer,
      contentType: response.ContentType,
      fileName: fileName,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

// Helper function to convert ReadableStream to Buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
