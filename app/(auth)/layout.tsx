import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Hello Gorgeous Med Spa",
  description: "Sign in to your Hello Gorgeous Med Spa account",
  robots: {
    index: false,
    follow: false,
  },
};

// Auth layout - full screen overlay that covers the root layout chrome
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-black to-black">
      {children}
    </div>
  );
}
