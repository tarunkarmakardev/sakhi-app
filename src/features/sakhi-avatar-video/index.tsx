"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import ReactPlayerType from "react-player";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type SakhiVideoPlayerProps = {
  src: string;
  onPlaybackEnded?: () => void;
  playing?: boolean;
  playbackTimings?: {
    start: number;
    end: number;
  };
};

export default function SakhiVideoPlayer({
  src,
  onPlaybackEnded,
  playing,
  playbackTimings,
}: SakhiVideoPlayerProps) {
  const playerRef = useRef<ReactPlayerType>(null);

  return (
    <ReactPlayer
      ref={playerRef}
      height="100%"
      width="100%"
      muted={false}
      playsinline
      playing={playing}
      url={src}
      onProgress={(e) => {
        const playedSeconds = Math.floor(e.playedSeconds);
        if (!playbackTimings) return;
        const { start, end } = playbackTimings;
        if (playedSeconds === end) {
          onPlaybackEnded?.();
          return;
        }
        if (playedSeconds >= end || playedSeconds < start) {
          playerRef.current?.seekTo(start);
        }
      }}
    />
  );
}
