type Props = {
  /** Nombre d'etoiles a afficher (affichage numerique, texte "n Etoile(s) Michelin"). */
  count: number;
  className?: string;
};

/**
 * Icone "fleur Michelin" stylisee en SVG (rosette simplifiee).
 */
const Rosette = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    className={`h-3.5 w-3.5 ${className}`}
  >
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      const cx = 10 + Math.cos(angle) * 4;
      const cy = 10 + Math.sin(angle) * 4;
      return <circle key={i} cx={cx} cy={cy} r="3.6" fill="currentColor" />;
    })}
    <circle cx="10" cy="10" r="3.6" fill="currentColor" />
    <circle cx="10" cy="10" r="1.4" fill="#c0012c" />
  </svg>
);

export const MichelinStar = ({ count, className = "" }: Props) => {
  if (count <= 0) return null;
  const label = count === 1 ? "1 Etoile Michelin" : `${count} Etoiles Michelin`;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-h2 font-medium text-secondary ${className}`}
      aria-label={label}
    >
      <Rosette className="text-secondary" />
      {label}
    </span>
  );
};
