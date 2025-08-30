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
  MediaPlayerLoop,
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
          width={1200}
          height={1200}
          alt="Preview"
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
          unoptimized
          priority
        />
      );
    }

    return (
      <MediaPlayer
        className={cn("h-auto w-full", mediaTypes.audio && "h-24 border")}
      >
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

        <MediaPlayerControls className="flex-col items-start gap-2.5 py-4">
          <MediaPlayerControlsOverlay />
          <MediaPlayerSeek withTime={mediaTypes.audio} />
          <div
            className={cn(
              "flex w-full items-center gap-2",
              mediaTypes.audio && "justify-center",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2",
                mediaTypes.audio ? "justify-center" : "flex-1",
              )}
            >
              {mediaTypes.audio && <MediaPlayerSeekBackward />}
              <MediaPlayerPlay />
              {mediaTypes.video && <MediaPlayerSeekBackward />}
              <MediaPlayerSeekForward />
              <MediaPlayerVolume expandable={mediaTypes.video} />
              {mediaTypes.video && <MediaPlayerTime />}
            </div>
            <div className="flex items-center gap-2">
              <PlaybackSpeed />
              {mediaTypes.audio && <MediaPlayerLoop />}
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
          "p-0 border-none overflow-hidden [&>[data-slot='dialog-close']]:hidden",
          mediaTypes.audio
            ? "sm:max-w-xl"
            : "w-auto sm:max-w-[95vw] max-h-[95vh] flex items-center justify-center",
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
