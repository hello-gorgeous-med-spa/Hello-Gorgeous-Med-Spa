"use client";

import { useRef, useCallback } from "react";
import { FadeUp } from "./Section";
import { BodyConsultationTool } from "./BodyConsultationTool";
import { BotoxCalculator } from "./BotoxCalculator";

export function HomepageInteractiveTools() {
  const botoxRef = useRef<HTMLDivElement>(null);

  const scrollToBotox = useCallback(() => {
    botoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FDF7FA]">
      <div className="max-w-6xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#E6007E]/15 text-[#E6007E] text-sm font-medium mb-4">
              ✨ Your Journey Starts Here
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#111111] mb-3">
              Plan Your Perfect{" "}
              <span className="text-[#E6007E]">Treatment</span>
            </h2>
            <p className="text-[#5E5E66] max-w-2xl mx-auto">
              Explore your concerns, get personalized recommendations, and estimate your Botox cost — all in one place.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left: Body Consultation Tool */}
          <FadeUp delayMs={80}>
            <div
              className="h-full min-h-[420px] md:min-h-[480px] flex flex-col rounded-xl border-2 border-black bg-white p-6 md:p-8 shadow-md hover:shadow-xl transition"
              aria-label="Virtual consultation tool"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-[#111111]">Virtual Consultation</h3>
              </div>
              <p className="text-[#5E5E66] text-sm mb-4">
                Click areas on the body you&apos;d like to improve → get your personalized treatment plan.
              </p>
              <div className="flex-1 min-h-0">
                <BodyConsultationTool onScrollToBotox={scrollToBotox} embedded />
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
