import Image from "next/image";

export const MuteToggle = ({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={muted ? "Activer le son" : "Couper le son"}
    className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-black/5 backdrop-blur-sm transition active:scale-95"
  >
    <Image
      src={muted ? "/icons/sound-off-red.svg" : "/icons/sound-1-red.svg"}
      alt=""
      width={20}
      height={20}
    />
  </button>
);
