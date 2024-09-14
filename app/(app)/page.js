import { Suspense } from "react";

import { FilesList, FilesListLoading } from "@/components/FilesList";
import { LoadingProgressBar, ProgressBar } from "@/components/ProgressBar";
import UploadButton from "@/components/client/UploadButton";

export default function Home({ searchParams }) {
  return (
    <>
      <div className="space-y-4 mt-4">
        <UploadButton fetchURL={process.env.WORKER_URL}/>
        <Suspense fallback={<FilesListLoading />}>
          <FilesList tag={searchParams.tag} />
        </Suspense>
        <Suspense fallback={<LoadingProgressBar />}>
          <ProgressBar />
        </Suspense>
      </div>
    </>
  );
}
