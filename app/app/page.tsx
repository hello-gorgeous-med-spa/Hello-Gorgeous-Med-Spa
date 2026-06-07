import type { Metadata } from "next";

import { ClientApp } from "@/components/client-app/ClientApp";
import { CLIENT_APP, type ClientAppTab } from "@/lib/client-app";
import { pageMetadata } from "@/lib/seo";

const VALID_TABS: ClientAppTab[] = ["home", "vitamin", "membership", "visit", "me"];

function parseTab(raw?: string): ClientAppTab {
  if (raw && VALID_TABS.includes(raw as ClientAppTab)) return raw as ClientAppTab;
  return "home";
}

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${CLIENT_APP.shortName} App — Book, Vitamin Bar & Memberships | Oswego, IL`,
    description:
      "Hello Gorgeous Med Spa client app — book appointments, pre-pay vitamin shots, join a membership, check in curbside, and access your portal.",
    path: CLIENT_APP.path,
  }),
  icons: {
    icon: "/icons/vitamin-bar-icon-192.png",
    apple: "/icons/vitamin-bar-icon-180.png",
  },
};

export default function HelloGorgeousAppPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  return <ClientApp initialTab={parseTab(searchParams?.tab)} />;
}
