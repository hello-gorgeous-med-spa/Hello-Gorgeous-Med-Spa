import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Staff Hub | Hello Gorgeous Med Spa",
  description: "Training, tools & resources for Hello Gorgeous staff.",
  robots: "noindex, nofollow",
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
