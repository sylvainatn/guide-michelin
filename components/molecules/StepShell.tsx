import type { ReactNode } from "react";

type StepShellProps = {
  badge: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export const StepShell = ({
  badge,
  title,
  subtitle,
  footer,
  children,
}: StepShellProps) => (
  <div className="flex flex-1 flex-col gap-5">
    <div className="space-y-3">
      <div>{badge}</div>
      <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-neutral-900">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
    </div>
    <div className="flex-1 space-y-5">{children}</div>
    <div className="pt-2">{footer}</div>
  </div>
);
