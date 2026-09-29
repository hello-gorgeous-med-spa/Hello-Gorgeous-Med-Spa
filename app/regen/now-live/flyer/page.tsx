import { RegenNowLiveFlyer } from "@/components/regen/RegenNowLiveFlyer";

export const metadata = {
  title: "REGEN RX launch flyer",
  robots: { index: false, follow: false },
};

export default function RegenNowLiveFlyerPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-[#0B4F4C]">
      <RegenNowLiveFlyer />
    </div>
  );
}
