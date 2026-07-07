import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Clinical Cheat Sheets | Admin",
  description: "Printable clinical reference PDFs for Hello Gorgeous staff.",
  robots: { index: false, follow: false },
};

export default function AdminCheatSheetsPage() {
  redirect("/staff/protocols?tab=cheat-sheets");
}
