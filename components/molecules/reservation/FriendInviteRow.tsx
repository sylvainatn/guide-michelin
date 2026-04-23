"use client";

import { CheckIcon } from "@/components/atoms/icons";
import type { InvitedFriend } from "@/types/reservation";

type Props = {
  friend: InvitedFriend;
  onToggle: () => void;
};

export const FriendInviteRow = ({ friend, onToggle }: Props) => {
  const invited = friend.status === "invited" || friend.status === "confirmed";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
      <span
        className="flex size-10 items-center justify-center rounded-full text-[15px] font-bold text-white"
        style={{ backgroundColor: friend.color }}
      >
        {friend.initial}
      </span>
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-sm font-bold text-tertiary">
          {friend.name}
        </span>
        <span className="truncate text-xs text-neutral-400">
          Dans votre liste
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
          invited
            ? "bg-primary text-white"
            : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
        }`}
      >
        {invited ? (
          <>
            Invité <CheckIcon className="size-3" />
          </>
        ) : (
          "Inviter"
        )}
      </button>
    </div>
  );
};
