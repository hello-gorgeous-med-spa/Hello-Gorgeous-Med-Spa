"use client";

import { FinalCTA } from "./FinalCTA";
import { HomepageLetsChat } from "./HomepageLetsChat";

/** Single black band: book CTA + contact form in two columns on md+ to save vertical space */
export function HomepageClosingCTARow() {
  return (
    <section
      className="relative overflow-hidden border-t-4 border-black py-10 md:py-14"
      style={{ backgroundColor: "#000000" }}
      aria-labelledby="elevate-look-heading lets-chat-heading"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.08)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <FinalCTA compact />
          <div className="border-t border-white/10 pt-2 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-10">
            <HomepageLetsChat compact />
          </div>
        </div>
      </div>
    </section>
  );
}
