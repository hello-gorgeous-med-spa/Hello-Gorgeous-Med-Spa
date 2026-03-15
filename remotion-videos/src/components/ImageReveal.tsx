import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

type RevealStyle = "zoom" | "pan" | "parallax" | "maskWipe";

interface ImageRevealProps {
  src: string;
  delay?: number;
  style?: RevealStyle;
  duration?: number;
  objectFit?: "cover" | "contain";
  borderRadius?: number;
  width?: number | string;
  height?: number | string;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  delay = 0,
  style = "zoom",
  duration = 60,
  objectFit = "cover",
  borderRadius = 12,
  width = "100%",
  height = "100%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let transform = "";

  switch (style) {
    case "zoom": {
      const scale = interpolate(f, [0, duration], [1.1, 1.0], { extrapolateRight: "clamp" });
      transform = `scale(${scale})`;
      break;
    }
    case "pan": {
      const tx = interpolate(f, [0, duration], [-5, 5], { extrapolateRight: "clamp" });
      transform = `translateX(${tx}%) scale(1.05)`;
      break;
    }
    case "parallax": {
      const ty = interpolate(f, [0, duration], [8, -8], { extrapolateRight: "clamp" });
      transform = `translateY(${ty}%) scale(1.08)`;
      break;
    }
    case "maskWipe": {
      const reveal = interpolate(f, [0, 20], [0, 100], { extrapolateRight: "clamp" });
      return (
        <div
          style={{
            width,
            height,
            borderRadius,
            overflow: "hidden",
            opacity,
            clipPath: `inset(0 ${100 - reveal}% 0 0)`,
          }}
        >
          <Img
            src={src.startsWith("http") ? src : staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit }}
          />
        </div>
      );
    }
  }

  return (
    <div style={{ width, height, borderRadius, overflow: "hidden", opacity }}>
      <Img
        src={src.startsWith("http") ? src : staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit, transform }}
      />
    </div>
  );
};
