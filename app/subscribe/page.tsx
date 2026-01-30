import { Metadata } from "next";
import { SubscribeContent } from "./SubscribeContent";

export const metadata: Metadata = {
  title: "Subscribe to No Prior Authorization | Free $75 Service | Hello Gorgeous Med Spa",
  description: "Join No Prior Authorization and receive a FREE service up to $75 at Hello Gorgeous Med Spa. Skip the wait, skip the hassle - get immediate care when you need it.",
  keywords: "no prior authorization, free med spa service, subscription, immediate care, no waiting, Oswego IL",
};

export default function SubscribePage() {
  return <SubscribeContent />;
}
