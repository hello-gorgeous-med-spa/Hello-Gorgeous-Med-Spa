"use client";

import { BodyConsultationTool } from "./BodyConsultationTool";

export function VirtualConsultationBody() {
  return (
    <section className="min-h-[80vh] bg-[#FDF7FA] px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <BodyConsultationTool embedded={false} />
      </div>
    </section>
  );
}
