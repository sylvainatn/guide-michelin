import type { ReactNode } from "react";

export const AuthSheet = ({ children }: { children: ReactNode }) => (
  <section className="relative -mt-6 flex-1 rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-[0_-12px_32px_-24px_rgba(0,0,0,0.25)]">
    <div
      aria-hidden
      className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-neutral-200"
    />
    {children}
  </section>
);
