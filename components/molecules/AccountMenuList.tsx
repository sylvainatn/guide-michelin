import type { ReactNode } from "react";

export const AccountMenuList = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm divide-y divide-neutral-100">
    {children}
  </div>
);
