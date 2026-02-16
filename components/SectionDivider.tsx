"use client";

import React from "react";

type DividerStyle = "wave" | "wave-inverse" | "gradient" | "gradient-thick" | "curve";

interface SectionDividerProps {
  style?: DividerStyle;
  className?: string;
}

/**
 * SectionDivider — Elegant pink separators between sections
 * Use INSTEAD of gray blocks/backgrounds
 * 
 * Styles:
 * - wave: Curved wave pointing down
 * - wave-inverse: Curved wave pointing up
 * - gradient: Thin gradient line
 * - gradient-thick: Wide gradient band
 * - curve: SVG curved separator
 */
export function SectionDivider({ style = "gradient", className = "" }: SectionDividerProps) {
  switch (style) {
    case "wave":
      return (
        <div 
          className={`w-full h-20 bg-[#FF2D8E] ${className}`}
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
          aria-hidden="true"
        />
      );
    
    case "wave-inverse":
      return (
        <div 
          className={`w-full h-20 bg-[#FF2D8E] ${className}`}
          style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }}
          aria-hidden="true"
        />
      );
    
    case "gradient":
      return (
        <div 
          className={`w-full h-1 ${className}`}
          style={{ 
            background: "linear-gradient(90deg, transparent, #FF2D8E, transparent)" 
          }}
          aria-hidden="true"
        />
      );
    
    case "gradient-thick":
      return (
        <div 
          className={`w-full h-32 ${className}`}
          style={{ 
            background: "linear-gradient(90deg, rgba(255,45,142,0) 0%, rgba(255,45,142,0.12) 25%, rgba(255,45,142,0.12) 75%, rgba(255,45,142,0) 100%)" 
          }}
          aria-hidden="true"
        />
      );
    
    case "curve":
      return (
        <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
          <svg 
            viewBox="0 0 1440 80" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-20"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" 
              fill="#FF2D8E"
            />
          </svg>
        </div>
      );
    
    default:
      return (
        <div 
          className={`w-full h-1 ${className}`}
          style={{ 
            background: "linear-gradient(90deg, transparent, #FF2D8E, transparent)" 
          }}
          aria-hidden="true"
        />
      );
  }
}

export default SectionDivider;
