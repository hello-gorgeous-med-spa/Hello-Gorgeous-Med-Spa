import type { Metadata } from "next";
import { BotoxCalculator } from "@/components/BotoxCalculator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox Price Calculator | Estimate Your Treatment Cost | Oswego, IL",
  description:
    "Get an instant Botox cost estimate. Select treatment areas—forehead, crow's feet, masseters, neck bands & more—and see your personalized price. $10/unit at Hello Gorgeous Med Spa.",
  path: "/botox-calculator",
});

export default function BotoxCalculatorPage() {
  return <BotoxCalculator embedded={false} />;
}
