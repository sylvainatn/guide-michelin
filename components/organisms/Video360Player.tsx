"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  src: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
};

export const Video360Player = ({
  src,
  className = "",
  muted = true,
  autoPlay = true,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Video element (off-DOM, sert juste de source de texture) ---
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = muted;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    videoRef.current = video;
    if (autoPlay) void video.play().catch(() => {});

    // --- Three.js setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 0.01);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Sphere inversée : on regarde l'intérieur.
    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Controls (drag pour tourner la caméra) ---
    let lon = 0;
    let lat = 0;
    let isDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let startLon = 0;
    let startLat = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      startLon = lon;
      startLat = lat;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      lon = startLon - (e.clientX - pointerStartX) * 0.2;
      lat = startLat + (e.clientY - pointerStartY) * 0.2;
      lat = Math.max(-85, Math.min(85, lat));
    };
    const onPointerUp = () => {
      isDown = false;
    };
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerUp);

    // --- Resize ---
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // --- Animation loop ---
    let rafId = 0;
    const tick = () => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      const target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerUp);
      video.pause();
      video.removeAttribute("src");
      video.load();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [src, autoPlay, muted]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-3">
        <button
          type="button"
          onClick={togglePlay}
          className="pointer-events-auto rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur hover:bg-black/70"
        >
          {playing ? "Pause" : "Lecture"}
        </button>
        <span className="pointer-events-none rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
          Fais glisser pour pivoter
        </span>
        <button
          type="button"
          onClick={toggleMute}
          className="pointer-events-auto rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur hover:bg-black/70"
        >
          {isMuted ? "Son OFF" : "Son ON"}
        </button>
      </div>
    </div>
  );
};
