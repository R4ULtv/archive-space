export enum FileTypeCategory {
  Image = "image",
  Video = "video",
  Audio = "audio",
  Document = "document",
  Archive = "archive",
  Text = "text",
  Code = "code",
  Font = "font",
  Other = "other",
}
export const fileTypeCategoryList = Object.values(FileTypeCategory);

export function getMimeTypeFromExtension(filename: string): string {
  const extension = filename.toLowerCase().split(".").pop();

  const mimeTypes: Record<string, string> = {
    // Text files
    txt: "text/plain",
    rtf: "text/rtf",
    csv: "text/csv",
    json: "application/json",
    xml: "application/xml",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    ts: "application/typescript",
    jsx: "application/javascript",
    tsx: "application/typescript",
    md: "text/markdown",
    yaml: "application/yaml",
    yml: "application/yaml",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    odt: "application/vnd.oasis.opendocument.text",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odp: "application/vnd.oasis.opendocument.presentation",

    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
    avif: "image/avif",
    heic: "image/heic",
    heif: "image/heif",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    flac: "audio/flac",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wma: "audio/x-ms-wma",
    opus: "audio/opus",

    // Video
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    webm: "video/webm",
    mkv: "video/x-matroska",
    m4v: "video/mp4",
    "3gp": "video/3gpp",
    ogv: "video/ogg",

    // Archives
    zip: "application/zip",
    rar: "application/vnd.rar",
    "7z": "application/x-7z-compressed",
    tar: "application/x-tar",
    gz: "application/gzip",
    bz2: "application/x-bzip2",
    xz: "application/x-xz",

    // Executables and binaries
    exe: "application/octet-stream",
    msi: "application/x-msdownload",
    deb: "application/vnd.debian.binary-package",
    rpm: "application/x-rpm",
    dmg: "application/x-apple-diskimage",
    iso: "application/x-iso9660-image",

    // Fonts
    ttf: "font/ttf",
    otf: "font/otf",
    woff: "font/woff",
    woff2: "font/woff2",
    eot: "application/vnd.ms-fontobject",

    // Other common types
    apk: "application/vnd.android.package-archive",
    ipa: "application/octet-stream",
    torrent: "application/x-bittorrent",
    sketch: "application/octet-stream",
    fig: "application/octet-stream",
    ai: "application/postscript",
    eps: "application/postscript",
    psd: "image/vnd.adobe.photoshop",
  };

  return extension
    ? mimeTypes[extension] || "application/octet-stream"
    : "application/octet-stream";
}

export function getFileTypeCategory(filename: string): FileTypeCategory {
  const mimeType = getMimeTypeFromExtension(filename);

  if (mimeType.startsWith("image/")) return FileTypeCategory.Image;
  if (mimeType.startsWith("video/")) return FileTypeCategory.Video;
  if (mimeType.startsWith("audio/")) return FileTypeCategory.Audio;
  if (mimeType.startsWith("font/")) return FileTypeCategory.Font;

  // Checking for code before general text to ensure correct categorization
  if (
    mimeType.startsWith("application/javascript") ||
    mimeType.startsWith("application/typescript") ||
    mimeType.includes("html") ||
    mimeType.includes("css") ||
    mimeType.includes("json") ||
    mimeType.includes("xml") ||
    mimeType.includes("yaml") ||
    mimeType.includes("markdown")
  ) {
    return FileTypeCategory.Code;
  }

  // Specific document types
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("msword") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("opendocument")
  ) {
    return FileTypeCategory.Document;
  }

  // Archives
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar") ||
    mimeType.includes("7z") ||
    mimeType.includes("gzip") ||
    mimeType.includes("bzip2") ||
    mimeType.includes("xz")
  ) {
    return FileTypeCategory.Archive;
  }

  // General text files
  if (mimeType.startsWith("text/")) {
    return FileTypeCategory.Text;
  }

  return FileTypeCategory.Other;
}

export function isPreviewSupported(mimeType: string): boolean {
  // Add your supported mime types here
  const supportedTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/webm",
    "video/ogg",
    // Audio
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
  ];

  return supportedTypes.includes(mimeType.toLowerCase());
}
