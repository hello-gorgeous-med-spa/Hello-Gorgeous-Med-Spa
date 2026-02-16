"use client";

import Link from "next/link";
import { BodyConsultationTool } from "./BodyConsultationTool";
import { BOOKING_URL } from "@/lib/flows";

export function VirtualConsultationBody() {
  return (
    <section className="min-h-[80vh] bg-[#FFFFFF] px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center md:text-right">
          <p className="text-[#000000] text-sm">
            Know what you want?{" "}
            <Link href={BOOKING_URL} className="text-hg-pink hover:text-hg-pinkDeep font-semibold underline underline-offset-2">
              Book directly →
            </Link>
          </p>
        </div>
        <BodyConsultationTool embedded={false} />
      </div>
    </section>
  );
}
