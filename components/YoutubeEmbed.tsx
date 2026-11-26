"use client";

import { useState } from "react";

// Click-to-play YouTube embed. The page renders only the thumbnail and a
// play button (fast, no YouTube JS), and the real iframe loads only when
// the visitor taps play - so video pages open instantly instead of
// feeling stuck behind YouTube's player.
export default function YoutubeEmbed({
  embedUrl,
  thumbnailUrl,
  title,
  isShort,
}: {
  embedUrl: string;
  thumbnailUrl: string;
  title: string;
  isShort?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={embedUrl + "?autoplay=1&rel=0"}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={"Play video: " + title}
      className="group relative block h-full w-full cursor-pointer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt={title}
        className={
          "h-full w-full " + (isShort ? "object-cover" : "object-cover")
        }
        width={480}
        height={360}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-system-green/70 bg-black/70 text-system-green transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1 h-7 w-7">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/85">
        Tap to play
      </span>
    </button>
  );
}
