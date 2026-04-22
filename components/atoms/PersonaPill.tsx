import { RosetteIcon } from "./icons";

export const PersonaPill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
    <RosetteIcon className="size-3.5 text-primary" />
    {label}
  </span>
);
