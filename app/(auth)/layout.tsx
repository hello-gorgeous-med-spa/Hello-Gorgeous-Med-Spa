import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sign In | Hello Gorgeous Med Spa",
  description: "Sign in to your Hello Gorgeous Med Spa account",
  robots: {
    index: false,
    follow: false,
  },
};

// Minimal layout for auth pages - NO Header, Footer, AuthWrapper, etc.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
