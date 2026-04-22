import { LogoBadge } from "./LogoBadge";

export const AuthHero = () => (
  <div className="relative h-[42vh] min-h-65 w-full overflow-hidden">
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, #c9d3dc 0%, #e2d7c0 55%, #f3e9d6 100%)",
      }}
    />
    <svg
      aria-hidden
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <circle cx="300" cy="90" r="40" fill="#e7d7a8" opacity="0.9" />
      <path
        d="M0 230 L70 200 L130 215 L190 190 L250 210 L320 195 L400 220 L400 320 L0 320 Z"
        fill="#d9c69a"
        opacity="0.8"
      />
      <path
        d="M0 255 L60 240 L120 250 L190 235 L260 245 L330 235 L400 250 L400 320 L0 320 Z"
        fill="#cbb582"
        opacity="0.7"
      />
      <rect x="185" y="195" width="28" height="60" fill="#b89f6d" opacity="0.55" />
      <rect x="192" y="180" width="14" height="20" fill="#b89f6d" opacity="0.55" />
    </svg>
    <div className="absolute left-6 top-8">
      <LogoBadge />
    </div>
  </div>
);
