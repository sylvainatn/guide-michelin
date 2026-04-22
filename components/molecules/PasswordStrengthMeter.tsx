const LABELS = ["Trop court", "Faible", "Moyen", "Fort", "Très fort"] as const;

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const scorePassword = (pwd: string): PasswordStrength => {
  if (pwd.length < 8) return 0;
  let s = 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s += 1;
  if (/\d/.test(pwd)) s += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
  return Math.min(s, 4) as PasswordStrength;
};

export const PasswordStrengthMeter = ({ score }: { score: PasswordStrength }) => (
  <div className="flex items-center gap-3">
    <div className="flex flex-1 gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < score ? "bg-primary" : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
    <span className="min-w-12 text-right text-xs font-medium text-neutral-500">
      {LABELS[score]}
    </span>
  </div>
);
