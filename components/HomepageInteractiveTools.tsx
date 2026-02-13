"use client";

import { useRef, useCallback } from "react";
import { FadeUp } from "./Section";
import { InteractiveConsultationWidget } from "./InteractiveConsultationWidget";
import { BotoxCalculator } from "./BotoxCalculator";

export function HomepageInteractiveTools() {
  const botoxRef = useRef<HTMLDivElement>(null);

  const scrollToBotox = useCallback(() => {
    botoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-black via-pink-950/10 to-black">
      <div className="max-w-6xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              ✨ Your Journey Starts Here
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Plan Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Treatment
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore your concerns, get personalized recommendations, and estimate your Botox cost — all in one place.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left: Interactive Consultation */}
          <FadeUp delayMs={80}>
            <div
              className="h-full min-h-[360px] md:min-h-[420px] flex flex-col rounded-2xl md:rounded-3xl border border-pink-500/20 bg-gradient-to-b from-gray-900 to-black p-4 md:p-6"
              aria-label="Virtual consultation tool"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-white">Virtual Consultation</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Click areas you&apos;d like to improve → select concerns → get your personalized treatment plan.
              </p>
              <div className="flex-1 min-h-0">
                <InteractiveConsultationWidget onScrollToBotox={scrollToBotox} />
              </div>
            </div>
          </FadeUp>

          {/* Right: Botox Calculator */}
          <FadeUp delayMs={120}>
            <div ref={botoxRef} className="h-full min-h-0">
              <BotoxCalculator embedded />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
