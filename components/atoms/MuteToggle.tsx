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
    className="flex size-10 items-center justify-center rounded-full  transition active:scale-95"
  >
    <Image
      src={muted ? "/icons/sound-off-white.svg" : "/icons/sound-1-white.svg"}
      alt=""
      width={20}
      height={20}
    />
  </button>
);
