import Image from "next/image";

export const LogoBadge = () => (
  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-md ring-1 ring-black/5">
    <Image
      src="/logos/mini-default-logo.png"
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0"
    />
    <span className="flex flex-col leading-none text-primary">
      <span className="text-[9px] font-semibold tracking-[0.12em]">LE GUIDE</span>
      <span className="mt-0.5 text-[13px] font-bold tracking-wide">
        MICHELIN
      </span>
    </span>
  </div>
);
