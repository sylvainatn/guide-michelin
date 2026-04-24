"use client";

import { Viewer as PSViewer } from "@photo-sphere-viewer/core";
import { useEffect, useRef } from "react";

type Props = {
  photo: string;
};

export default function InlinePhotoSphere({ photo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof PSViewer> | null>(null);

  useEffect(() => {
    let rafId: number;
    let viewer: InstanceType<typeof PSViewer> | null = null;

    rafId = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el || !photo) return;

      viewer = new PSViewer({
        container: el,
        panorama: photo,
        navbar: false,
        loadingTxt: "Chargement…",
        defaultZoomLvl: 0,
        // Make it non-interactive or interactive?
        // Usually an inline hero is interactive, or maybe we just let them drag
      });
      viewerRef.current = viewer;
    });

    return () => {
      cancelAnimationFrame(rafId);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [photo]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
