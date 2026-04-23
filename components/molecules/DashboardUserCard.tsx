"use client";

import { LogoutIcon } from "../atoms/icons";

type Props = {
  firstName: string;
  email: string;
  onLogout: () => void;
};

export const DashboardUserCard = ({ firstName, email, onLogout }: Props) => (
  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-michelin-red-700 text-sm font-semibold text-white">
      {(firstName[0] ?? "?").toUpperCase()}
    </span>
    <div className="min-w-0 flex-1 leading-tight">
      <p className="truncate text-[13px] font-semibold text-tertiary">
        {firstName}
      </p>
      <p className="truncate text-[11px] text-neutral-500">{email}</p>
    </div>
    <button
      type="button"
      onClick={onLogout}
      aria-label="Déconnexion"
      className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-primary"
    >
      <LogoutIcon className="size-4" />
    </button>
  </div>
);
