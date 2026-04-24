import type { Ref, VideoHTMLAttributes } from "react";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  ref?: Ref<HTMLVideoElement>;
};

export const Video = ({ className = "", ref, ...props }: VideoProps) => (
  <video
    ref={ref}
    playsInline
    muted
    loop
    preload="metadata"
    {...props}
    className={`h-full w-full object-cover ${className}`}
    suppressHydrationWarning
  />
);
