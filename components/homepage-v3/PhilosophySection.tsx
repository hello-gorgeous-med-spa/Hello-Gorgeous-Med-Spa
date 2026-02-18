"use client";

export function PhilosophySection() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <blockquote className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-tight">
          Confidence Should Feel{" "}
          <span className="text-[#E6007E]">Effortless.</span>
        </blockquote>
        <p className="mt-8 text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
          At Hello Gorgeous, we believe true beauty is about enhancing what makes
          you uniquely you — with precision, intention, and care.
        </p>
        <div className="mt-12 flex justify-center">
          <div className="w-16 h-0.5 bg-[#E6007E]" />
        </div>
      </div>
    </section>
  );
}
