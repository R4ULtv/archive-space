export const calculateOptimalChunkSize = (fileSize: number): number => {
  const MB = 1024 * 1024;
  // For small files (0MB - 50MB), use 5MB chunks
  if (fileSize < 50 * MB) {
    return 5 * MB;
  }
  // For files (50MB - 200MB), use 10MB chunks
  else if (fileSize < 200 * MB) {
    return 10 * MB;
  }
  // For files (200MB - 512MB), use 15MB chunks
  else if (fileSize < 512 * MB) {
    return 15 * MB;
  }
  // For files (512MB - 1GB), use 25MB chunks
  else if (fileSize < 1024 * MB) {
    return 25 * MB;
  }
  // For files (1GB - 2GB), use 35MB chunks
  else if (fileSize < 2 * 1024 * MB) {
    return 35 * MB;
  }
  // For very large files (> 2GB), use 50MB chunks
  else {
    return 50 * MB;
  }
};
