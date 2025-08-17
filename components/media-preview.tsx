import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MediaPlayer,
  MediaPlayerAudio,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerDownload,
  MediaPlayerFullscreen,
  MediaPlayerPlay,
  MediaPlayerSeek,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerTime,
  MediaPlayerVideo,
  MediaPlayerVolume,
  PlaybackSpeed,
} from "@/components/ui/media-player";
import { cn } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface MediaPreviewProps {
  src: string;
  type: string;
}

export function MediaPreview({ src, type }: MediaPreviewProps) {
  const mediaTypes = useMemo(
    () => ({
      audio: type.startsWith("audio"),
      video: type.startsWith("video"),
      image: type.startsWith("image"),
    }),
    [type],
  );

  const mediaContent = useMemo(() => {
    if (mediaTypes.image) {
      return (
        <Image
          src={src}
          width={800}
          height={600}
          alt="Preview"
          className="object-contain"
          unoptimized
          priority
        />
      );
    }

    return (
      <MediaPlayer className={cn("h-auto w-full", mediaTypes.audio && "h-32")}>
        {mediaTypes.video && (
          <MediaPlayerVideo crossOrigin="use-credentials" preload="metadata">
            <source src={src} type={type} />
          </MediaPlayerVideo>
        )}

        {mediaTypes.audio && (
          <MediaPlayerAudio
            crossOrigin="use-credentials"
            className="sr-only"
            preload="metadata"
          >
            <source src={src} type={type} />
          </MediaPlayerAudio>
        )}

        <MediaPlayerControls className="flex-col items-start gap-2.5">
          <MediaPlayerControlsOverlay />
          <MediaPlayerSeek withTime />
          <div className="flex w-full items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <MediaPlayerPlay />
              <MediaPlayerSeekBackward />
              <MediaPlayerSeekForward />
              <MediaPlayerVolume expandable />
              {mediaTypes.video && <MediaPlayerTime />}
            </div>
            <div className="flex items-center gap-2">
              <MediaPlayerDownload />
              <PlaybackSpeed />
              {mediaTypes.video && <MediaPlayerFullscreen />}
            </div>
          </div>
        </MediaPlayerControls>
      </MediaPlayer>
    );
  }, [mediaTypes, src, type]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground/80"
          aria-label="Preview media"
        >
          <EyeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 border-none overflow-hidden",
          mediaTypes.audio
            ? "sm:max-w-xl max-h-32"
            : "w-auto sm:max-w-3xl max-h-[94vh]",
        )}
      >
        <DialogTitle className="sr-only">
          {mediaTypes.image ? "Image" : "Media"} Preview
        </DialogTitle>
        <DialogDescription className="sr-only">
          The {mediaTypes.image ? "image" : "media"} preview will be displayed
          here.
        </DialogDescription>
        {mediaContent}
      </DialogContent>
    </Dialog>
  );
}
