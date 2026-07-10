"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hgos/AuthContext";

function AdminLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (
      isAuthenticated &&
      user &&
      ["owner", "admin", "staff", "provider", "readonly"].includes(user.role)
    ) {
      const returnTo = searchParams.get("returnTo") || "/admin";
      router.replace(returnTo.startsWith("/admin") ? returnTo : "/admin");
      return;
    }

    const returnTo = searchParams.get("returnTo") || "/admin";
    router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}&staff=1`);
  }, [isLoading, isAuthenticated, user, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#FF2D8E] border-t-transparent" />
        <p className="text-sm text-white/70">Opening team sign-in…</p>
        <Link href="/login?staff=1&returnTo=/admin" className="mt-4 inline-block text-sm text-[#FFB8DC] hover:underline">
          Continue manually
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2D8E] border-t-transparent" />
        </div>
      }
    >
      <AdminLoginRedirect />
    </Suspense>
  );
}
