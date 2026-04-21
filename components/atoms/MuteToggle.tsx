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
    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition active:scale-95"
  >
    {muted ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 12L21 16.5 19.5 18 15 13.5 10.5 18 9 16.5 13.5 12 9 7.5 10.5 6 15 10.5 19.5 6 21 7.5zM5 9H2v6h3l5 5V4z" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.03v7.93A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-0.91 7-4.49 7-8.77S18 4.14 14 3.23z" />
      </svg>
    )}
  </button>
);
