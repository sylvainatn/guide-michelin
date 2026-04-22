import { LogoutIcon } from "../atoms/icons";

export const LogoutRow = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-center gap-2 py-3 text-[13px] font-medium text-neutral-500 transition-colors hover:text-primary"
  >
    <LogoutIcon className="h-4 w-4" />
    Se déconnecter
  </button>
);
