"use client";

import { FinalCTA } from "./FinalCTA";
import { HomepageLetsChat } from "./HomepageLetsChat";

/** Single black band: book CTA + contact form in two columns on md+ to save vertical space */
export function HomepageClosingCTARow() {
  return (
    <section
      className="bg-black py-10 md:py-14 border-t border-white/10"
      aria-labelledby="elevate-look-heading lets-chat-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
          <FinalCTA compact />
          <div className="md:border-l md:border-white/10 md:pl-8 lg:pl-10 pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
            <HomepageLetsChat compact />
          </div>
        </div>
      </div>
    </section>
  );
}
