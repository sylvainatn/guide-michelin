import { RosetteIcon } from "../atoms/icons";

type Props = {
  inspectorName: string;
  verdict: string | null;
};

export const InspectorCard = ({ inspectorName, verdict }: Props) => (
  <article className="flex flex-col gap-3 rounded-2xl bg-neutral-900 p-4 text-white shadow-lg">
    <header className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary">
        <RosetteIcon className="size-5 text-white" />
      </span>
      <div className="flex-1">
        <p className="text-[14px] font-semibold">{inspectorName}</p>
        <p className="text-[11px] text-white/60">Verdict officiel</p>
      </div>
      <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
        Vérifié
      </span>
    </header>
    {verdict && (
      <p className="text-[13px] leading-relaxed text-white/85">{verdict}</p>
    )}
  </article>
);
