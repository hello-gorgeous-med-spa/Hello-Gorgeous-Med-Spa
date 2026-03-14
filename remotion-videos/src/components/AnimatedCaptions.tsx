import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface CaptionWord {
  word: string;
  start: number; // seconds
  end: number; // seconds
}

interface AnimatedCaptionsProps {
  words: CaptionWord[];
  style?: "bold" | "highlight" | "typewriter" | "bounce";
  primaryColor?: string;
  backgroundColor?: string;
  position?: "bottom" | "center" | "top";
  maxWordsPerLine?: number;
}

export const AnimatedCaptions: React.FC<AnimatedCaptionsProps> = ({
  words,
  style = "highlight",
  primaryColor = "#E91E8C",
  backgroundColor = "rgba(0,0,0,0.7)",
  position = "bottom",
  maxWordsPerLine = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Group words into lines
  const getVisibleWords = () => {
    const visible: CaptionWord[] = [];
    for (const word of words) {
      if (word.start <= currentTime && word.end >= currentTime - 2) {
        visible.push(word);
      }
    }
    return visible.slice(-maxWordsPerLine * 2); // Show last 2 lines max
  };

  const visibleWords = getVisibleWords();
  
  // Split into lines
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < visibleWords.length; i += maxWordsPerLine) {
    lines.push(visibleWords.slice(i, i + maxWordsPerLine));
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    bottom: { bottom: 100, left: 0, right: 0 },
    center: { top: "50%", left: 0, right: 0, transform: "translateY(-50%)" },
    top: { top: 100, left: 0, right: 0 },
  };

  const renderWord = (word: CaptionWord, index: number, lineIndex: number) => {
    const isCurrentWord = word.start <= currentTime && word.end >= currentTime;
    const wordFrame = Math.max(0, frame - word.start * fps);

    // Animation based on style
    let wordStyle: React.CSSProperties = {
      display: "inline-block",
      margin: "0 6px",
      transition: "all 0.1s ease",
    };

    switch (style) {
      case "highlight":
        wordStyle = {
          ...wordStyle,
          color: isCurrentWord ? primaryColor : "#FFFFFF",
          textShadow: isCurrentWord
            ? `0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}`
            : "2px 2px 4px rgba(0,0,0,0.8)",
          transform: isCurrentWord ? "scale(1.15)" : "scale(1)",
        };
        break;

      case "bold":
        const boldScale = spring({
          frame: wordFrame,
          fps,
          from: 0.5,
          to: 1,
          config: { damping: 10, stiffness: 100 },
        });
        wordStyle = {
          ...wordStyle,
          color: "#FFFFFF",
          textShadow: `0 0 10px ${primaryColor}, 2px 2px 4px rgba(0,0,0,0.8)`,
          transform: `scale(${isCurrentWord ? boldScale : 1})`,
          opacity: isCurrentWord ? 1 : 0.8,
        };
        break;

      case "typewriter":
        const typeOpacity = interpolate(
          wordFrame,
          [0, 3],
          [0, 1],
          { extrapolateRight: "clamp" }
        );
        wordStyle = {
          ...wordStyle,
          color: "#FFFFFF",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          opacity: typeOpacity,
        };
        break;

      case "bounce":
        const bounceY = spring({
          frame: wordFrame,
          fps,
          from: -30,
          to: 0,
          config: { damping: 8, stiffness: 150 },
        });
        wordStyle = {
          ...wordStyle,
          color: isCurrentWord ? primaryColor : "#FFFFFF",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          transform: `translateY(${isCurrentWord ? bounceY : 0}px)`,
        };
        break;
    }

    return (
      <span key={`${lineIndex}-${index}`} style={wordStyle}>
        {word.word.toUpperCase()}
      </span>
    );
  };

  if (visibleWords.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 40px",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor,
          borderRadius: 16,
          padding: "16px 32px",
        }}
      >
        {lines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: lineIndex < lines.length - 1 ? 8 : 0,
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: 2,
                lineHeight: 1.3,
              }}
            >
              {line.map((word, index) => renderWord(word, index, lineIndex))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCaptions;
