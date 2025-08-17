import { getFileTypeCategory, getMimeTypeFromExtension } from "@/lib/mime-type";
import {
  CodeIcon,
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  TypeIcon,
  VideoIcon,
} from "lucide-react";

export const getFileIcon = (file: {
  file: File | { type: string; name: string };
}) => {
  const fileName = file.file instanceof File ? file.file.name : file.file.name;
  const fileType = file.file instanceof File ? file.file.type : file.file.type;

  // Use MIME type from extension if browser type is not available or generic
  const mimeType =
    fileType && fileType !== "application/octet-stream"
      ? fileType
      : getMimeTypeFromExtension(fileName);

  const category = getFileTypeCategory(fileName);

  switch (category) {
    case "document":
      if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
        return <FileSpreadsheetIcon className="size-4 opacity-60" />;
      }
      return <FileTextIcon className="size-4 opacity-60" />;
    case "archive":
      return <FileArchiveIcon className="size-4 opacity-60" />;
    case "video":
      return <VideoIcon className="size-4 opacity-60" />;
    case "audio":
      return <HeadphonesIcon className="size-4 opacity-60" />;
    case "image":
      return <FileImageIcon className="size-4 opacity-60" />;
    case "text":
      return <FileTextIcon className="size-4 opacity-60" />;
    case "code":
      return <CodeIcon className="size-4 opacity-60" />;
    case "font":
      return <TypeIcon className="size-4 opacity-60" />;
    case "other":
      return <FileIcon className="size-4 opacity-60" />;
    default:
      return <FileIcon className="size-4 opacity-60" />;
  }
};
