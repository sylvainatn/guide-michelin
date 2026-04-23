"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BuildingIcon,
  CompassIcon,
  CubeIcon,
  CutleryCrossedIcon,
  UserIcon,
} from "../atoms/icons";
import { DashboardBrand } from "../molecules/DashboardBrand";
import { DashboardNavItem } from "../molecules/DashboardNavItem";
import { DashboardUserCard } from "../molecules/DashboardUserCard";
import { useAuth } from "../../lib/auth/context";

const NAV = [
  {
    href: "/dashboard",
    label: "Vue d'ensemble",
    icon: <CubeIcon className="size-4" />,
    matchExact: true,
  },
  {
    href: "/dashboard/restaurants",
    label: "Mes restaurants",
    icon: <CutleryCrossedIcon className="size-4" />,
  },
  {
    href: "/dashboard/accommodations",
    label: "Mes hébergements",
    icon: <BuildingIcon className="size-4" />,
  },
  {
    href: "/account",
    label: "Mon compte",
    icon: <UserIcon className="size-4" />,
  },
  {
    href: "/feed",
    label: "Voir le feed",
    icon: <CompassIcon className="size-4" />,
  },
] as const;

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string, matchExact = false) => {
    if (!pathname) return false;
    if (matchExact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    void logout().then(() => router.replace("/signin"));
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-6 border-r border-neutral-200 bg-neutral-50 px-4 py-6">
      <DashboardBrand />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <DashboardNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, "matchExact" in item && item.matchExact)}
          />
        ))}
      </nav>

      {user && (
        <DashboardUserCard
          firstName={user.firstName}
          email={user.email}
          onLogout={handleLogout}
        />
      )}
    </aside>
  );
};
