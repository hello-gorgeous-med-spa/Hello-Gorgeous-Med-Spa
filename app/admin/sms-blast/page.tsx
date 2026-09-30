import { Metadata } from "next";
import { SmsBlastPanel } from "@/components/admin/SmsBlastPanel";

export const metadata: Metadata = {
  title: "SMS Blast Panel | Hello Gorgeous",
  description: "SMS/MMS marketing tool — audiences, compliance, cost calculator",
  robots: { index: false, follow: false },
};

export default function SmsBlastPage() {
  return <SmsBlastPanel />;
}
