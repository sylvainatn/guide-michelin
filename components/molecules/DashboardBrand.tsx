import { RosetteIcon } from "../atoms/icons";

export const DashboardBrand = () => (
  <div className="flex items-center gap-2.5 px-2">
    <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
      <RosetteIcon className="size-5" />
    </span>
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
        Michelin Guide
      </span>
      <span className="text-[15px] font-bold text-tertiary">Admin</span>
    </div>
  </div>
);
