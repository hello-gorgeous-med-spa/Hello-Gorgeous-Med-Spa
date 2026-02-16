"use client";

/** Wave divider - full-width hot pink curved shape between sections */
export function PinkWaveDivider() {
  return (
    <div className="w-full overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path
          d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
          fill="#FF2D8E"
        />
      </svg>
    </div>
  );
}

/** Gradient band - 120px hot pink fade between sections */
export function PinkGradientBand() {
  return (
    <div
      className="w-full h-[120px]"
      style={{
        background: "linear-gradient(90deg, #FF2D8E 0%, transparent 50%, #FF2D8E 100%)",
      }}
      aria-hidden
    />
  );
}

/** Soft organic blob divider */
export function PinkBlobDivider() {
  return (
    <div className="w-full overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path
          d="M0 60C200 60 400 0 720 20C1040 40 1240 0 1440 20V60H0Z"
          fill="#FF2D8E"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
