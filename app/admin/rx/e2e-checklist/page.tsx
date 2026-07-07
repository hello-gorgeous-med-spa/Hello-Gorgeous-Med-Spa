import type { Metadata } from "next";
import { redirect } from "next/navigation";

/** Legacy URL — canonical go-live dashboard is /admin/rx/go-live */
export default function RxE2eChecklistRedirect() {
  redirect("/admin/rx/go-live");
}
