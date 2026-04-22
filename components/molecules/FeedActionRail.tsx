"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  HeartFilledIcon,
  HeartIcon,
  ShareIcon,
} from "../atoms/icons";

const Action = ({
  icon,
  label,
  active = false,
  activeTint = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  activeTint?: boolean;
  onClick?: () => void;
}) => {
  const bg = activeTint
    ? "bg-primary text-white"
    : active
    ? "bg-white text-primary"
    : "bg-white/95 text-neutral-800";
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto flex flex-col items-center gap-1"
    >
      <span
        className={`flex size-11 items-center justify-center rounded-full shadow ring-1 ring-black/5 ${bg}`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-white drop-shadow">
        {label}
      </span>
    </button>
  );
};

export const FeedActionRail = ({
  onShare,
}: {
  onShare?: () => void;
} = {}) => {
  const [saved, setSaved] = useState(false);
  const [loved, setLoved] = useState(true);

  return (
    <div
      className="pointer-events-none absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Action
        icon={
          saved ? (
            <BookmarkFilledIcon className="size-5" />
          ) : (
            <BookmarkIcon className="size-5" />
          )
        }
        label="Sauver"
        active={saved}
        onClick={() => setSaved((v) => !v)}
      />
      <Action
        icon={<ShareIcon className="size-5" />}
        label="Partager"
        onClick={onShare}
      />
      <Action
        icon={
          loved ? (
            <HeartFilledIcon className="size-5" />
          ) : (
            <HeartIcon className="size-5" />
          )
        }
        label="En favori"
        activeTint={loved}
        onClick={() => setLoved((v) => !v)}
      />
    </div>
  );
};
