"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../../lib/auth/context";
import { restaurantApi } from "../../lib/restaurants/client";
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
  disabled = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  activeTint?: boolean;
  disabled?: boolean;
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
      disabled={disabled}
      className="pointer-events-auto flex flex-col items-center gap-1 disabled:opacity-60"
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

type BookmarkState = {
  restaurantId: string;
  initialSaved: boolean;
  initialFavorited: boolean;
};

type Props = {
  bookmark?: BookmarkState;
  onShare?: () => void;
};

export const FeedActionRail = ({ bookmark, onShare }: Props) => {
  const { getAccessToken } = useAuth();
  const [saved, setSaved] = useState(bookmark?.initialSaved ?? false);
  const [loved, setLoved] = useState(bookmark?.initialFavorited ?? false);
  const [savePending, setSavePending] = useState(false);
  const [lovePending, setLovePending] = useState(false);

  const toggleSave = async () => {
    const token = getAccessToken();
    if (!token || savePending || !bookmark) return;
    const next = !saved;
    setSaved(next);
    setSavePending(true);
    try {
      await restaurantApi.setBookmark(token, bookmark.restaurantId, next);
    } catch {
      setSaved(!next);
    } finally {
      setSavePending(false);
    }
  };

  const toggleLove = async () => {
    const token = getAccessToken();
    if (!token || lovePending || !bookmark) return;
    const next = !loved;
    setLoved(next);
    setLovePending(true);
    try {
      await restaurantApi.setFavorite(token, bookmark.restaurantId, next);
    } catch {
      setLoved(!next);
    } finally {
      setLovePending(false);
    }
  };

  return (
    <div
      className="pointer-events-none absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {bookmark && (
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
          disabled={savePending}
          onClick={toggleSave}
        />
      )}
      <Action
        icon={<ShareIcon className="size-5" />}
        label="Partager"
        onClick={onShare}
      />
      {bookmark && (
        <Action
          icon={
            loved ? (
              <HeartFilledIcon className="size-5" />
            ) : (
              <HeartIcon className="size-5" />
            )
          }
          label="Enregistrer"
          activeTint={loved}
          disabled={lovePending}
          onClick={toggleLove}
        />
      )}
    </div>
  );
};
