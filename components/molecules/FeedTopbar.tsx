"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { CircleIconButton } from "../atoms/CircleIconButton";
import { PersonaPill } from "../atoms/PersonaPill";
import { SearchIcon } from "../atoms/icons";

export const FeedTopbar = ({ persona }: { persona: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const initial = user?.firstName?.slice(0, 1).toUpperCase() ?? "M";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-4"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <div className="pointer-events-auto min-w-0">
        <PersonaPill label={persona} />
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <CircleIconButton aria-label="Rechercher">
          <SearchIcon className="size-5" />
        </CircleIconButton>
        <button
          type="button"
          onClick={() => router.push("/account")}
          aria-label="Mon compte"
          className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow"
        >
          {initial}
        </button>
      </div>
    </div>
  );
};
