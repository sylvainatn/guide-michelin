const CONFETTI = [
  { left: "9%", top: "8%", size: 16, color: "#c8102e" },
  { left: "85%", top: "6%", size: 12, color: "#fdb022" },
  { left: "19%", top: "18%", size: 10, color: "#3b82f6" },
  { left: "77%", top: "15%", size: 18, color: "#22c55e" },
  { left: "34%", top: "4%", size: 11, color: "#f97316" },
  { left: "65%", top: "10%", size: 9, color: "#c8102e" },
  { left: "15%", top: "13%", size: 9, color: "#fdb022" },
  { left: "83%", top: "21%", size: 11, color: "#c8102e" },
  { left: "42%", top: "5%", size: 8, color: "#22c55e" },
  { left: "55%", top: "3%", size: 10, color: "#3b82f6" },
  { left: "72%", top: "6%", size: 6, color: "#fdb022" },
  { left: "26%", top: "4%", size: 8, color: "#c8102e" },
  { left: "91%", top: "12%", size: 10, color: "#f97316" },
  { left: "4%", top: "23%", size: 8, color: "#22c55e" },
  { left: "50%", top: "8%", size: 8, color: "#fdb022" },
];

export const ConfettiBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {CONFETTI.map((c, i) => (
      <span
        key={i}
        aria-hidden
        className="absolute rounded-sm opacity-80"
        style={{
          left: c.left,
          top: c.top,
          width: c.size,
          height: c.size,
          backgroundColor: c.color,
          transform: `rotate(${(i * 47) % 360}deg)`,
        }}
      />
    ))}
  </div>
);
