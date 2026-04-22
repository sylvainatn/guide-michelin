import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export const MailIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 6.5 12 13l8.5-6.5" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4" y="10" width="16" height="10" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const EyeIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 12C4.5 7.5 8 5 12 5s7.5 2.5 9.5 7c-2 4.5-5.5 7-9.5 7s-7.5-2.5-9.5-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.5 6.2A9 9 0 0 1 12 6c4 0 7.5 2.5 9.5 7a15 15 0 0 1-3.3 4.3" />
    <path d="M6.2 7.7C4.4 9 3.1 10.7 2.5 12c2 4.5 5.5 7 9.5 7 1.6 0 3.1-.4 4.4-1" />
    <path d="M9.8 9.8a3 3 0 0 0 4.4 4.4" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const UserIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M4.5 20c1.3-3.6 4.3-5.5 7.5-5.5s6.2 1.9 7.5 5.5" />
  </svg>
);

export const AtIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const PaperPlaneIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 11 20.5 4l-5 17-4-7-8-3Z" />
    <path d="m11.5 14 4-7" />
  </svg>
);

export const LockFilledIcon = (props: IconProps) => (
  <svg {...base} {...props} fill="currentColor" stroke="none">
    <path d="M6 10.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-7A1.5 1.5 0 0 1 6 10.5Z" />
    <path
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      fill="none"
      d="M8 10.5V7a4 4 0 0 1 8 0v3.5"
    />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const PencilIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
    <path d="m13.5 6.5 4 4" />
  </svg>
);

export const WaveIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 9c2 0 3-2 6-2s4 2 6 2 3-2 6-2" />
    <path d="M3 14c2 0 3-2 6-2s4 2 6 2 3-2 6-2" />
    <path d="M3 19c2 0 3-2 6-2s4 2 6 2 3-2 6-2" />
  </svg>
);

export const MountainIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m3 20 6-10 4 6 3-4 5 8H3Z" />
  </svg>
);

export const GrapeIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v3" />
    <path d="M10 6h4" />
    <circle cx="9" cy="9" r="2" />
    <circle cx="15" cy="9" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="8" cy="14" r="2" />
    <circle cx="16" cy="14" r="2" />
    <circle cx="12" cy="17" r="2" />
  </svg>
);

export const BuildingIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="5" y="4" width="14" height="17" rx="1.5" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
  </svg>
);

export const CutleryCrossedIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 3v6a2 2 0 0 0 2 2v10" />
    <path d="M11 3v6M15 3c-1 1-2 3-2 5s1 3 2 3v10" />
  </svg>
);

export const SparklesIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 4l1.5 4L18 9.5 13.5 11 12 15l-1.5-4L6 9.5 10.5 8Z" />
    <path d="M19 16l.8 2L22 19l-2.2 1L19 22l-.8-2L16 19l2.2-1Z" />
  </svg>
);

export const RosetteIcon = (props: IconProps) => {
  const petals = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    const cx = 12 + Math.cos(angle) * 4.6;
    const cy = 12 + Math.sin(angle) * 4.6;
    return <circle key={i} cx={cx} cy={cy} r="4" fill="currentColor" />;
  });
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {petals}
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
};

export const LeafIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 4s-8 0-12 4-4 12-4 12 8 0 12-4 4-12 4-12Z" />
    <path d="M4 20 14 10" />
  </svg>
);

export const WineGlassIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 3h10l-1 7a4 4 0 0 1-8 0l-1-7Z" />
    <path d="M12 14v6M8 20h8" />
  </svg>
);

export const ColumnIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 6h16M4 20h16" />
    <path d="M6 4h12v2H6z" />
    <path d="M8 6v14M12 6v14M16 6v14" />
  </svg>
);

export const HeartIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const MapFoldedIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z" />
    <path d="M9 4v13M15 7v13" />
  </svg>
);

export const WalletIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18M16 14h2" />
  </svg>
);

export const CompassIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const StarSparkleIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m12 3 1.8 4.8L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.7Z" />
    <path d="m19 16 .7 1.8L21.5 18l-1.8.7L19 20l-.7-1.3L16.5 18l1.8-.2Z" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const BookmarkIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 4h12v17l-6-4-6 4V4Z" />
  </svg>
);

export const BookmarkFilledIcon = (props: IconProps) => (
  <svg {...base} {...props} fill="currentColor" stroke="none">
    <path d="M6 4h12v17l-6-4-6 4V4Z" />
  </svg>
);

export const ShareIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8 11 8-4M8 13l8 4" />
  </svg>
);

export const HeartFilledIcon = (props: IconProps) => (
  <svg {...base} {...props} fill="currentColor" stroke="none">
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);

export const CubeIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="M4 7l8 4 8-4M12 11v10" />
  </svg>
);

export const StarFilledIcon = (props: IconProps) => (
  <svg {...base} {...props} fill="currentColor" stroke="none">
    <path d="m12 3 2.6 6 6.4.5-4.9 4.3 1.5 6.2L12 16.9 6.4 20l1.5-6.2L3 9.5l6.4-.5L12 3Z" />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const CheckCircleFilledIcon = (props: IconProps) => (
  <svg {...base} {...props} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="10" />
    <path
      d="m7.5 12.5 3 3 6-6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
