"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { RxPortalDashboard } from "@/components/rx-portal/RxPortalDashboard";
import { getSession } from "@/lib/hgos/auth";
import { hgosRoleToPortalSkin, portalHomeForSkin, RX_PORTAL_BASE } from "@/lib/rx-portal/nav";

/** Landing — role skins land on their preferred home (dashboard stays for admin). */
export default function RxPortalHomePage() {
  const router = useRouter();

  useEffect(() => {
    void getSession().then((s) => {
      if (!s) return;
      const home = portalHomeForSkin(hgosRoleToPortalSkin(s.user.role));
      if (home !== RX_PORTAL_BASE) router.replace(home);
    });
  }, [router]);

  return <RxPortalDashboard />;
}
