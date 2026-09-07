import { PeppyChat } from "@/components/regen/PeppyChat";

export const metadata = {
  title: "Peppy | REGEN RX Ops",
  robots: { index: false, follow: false },
};

export default function OpsPeppyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Peppy</h1>
        <p className="mt-1 text-white/50">
          Clinic copilot. Ask how we approve, paste FormuConnect, refund, or talk to a guest. He does not replace Ryan.
        </p>
      </div>
      <PeppyChat surface="ops" variant="page" />
    </div>
  );
}
