import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
  Img,
  staticFile,
  Audio,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface SolariaCO2LaserProps {
  brandColor: string;
  accentColor: string;
  backgroundColor: string;
  format: VideoFormat;
}

const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame: frame - delay,
    fps,
    from: 50,
    to: 0,
    config: { damping: 12 },
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const GlowingOrb: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
}> = ({ color, size, x, y }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.3 + 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
};

const LaserBeamEffect: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const beamOpacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beamX = interpolate(frame, [0, 60], [-100, width + 100], {
    extrapolateRight: "clamp",
  });

  const beamWidth = interpolate(frame, [0, 30, 60], [50, 150, 50], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: beamX - beamWidth / 2,
          top: 0,
          width: beamWidth,
          height: height,
          background: `linear-gradient(90deg, transparent, ${brandColor}80, #FF69B4, ${brandColor}80, transparent)`,
          opacity: beamOpacity,
          filter: "blur(20px)",
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: beamX - 2,
          top: 0,
          width: 4,
          height: height,
          background: `linear-gradient(180deg, transparent 10%, white 50%, transparent 90%)`,
          opacity: beamOpacity * 0.8,
          boxShadow: `0 0 30px ${brandColor}, 0 0 60px #FF69B4`,
          zIndex: 101,
        }}
      />
    </>
  );
};

const LogoWatermark: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  const fontSize = format === "horizontal" ? 18 : format === "square" ? 20 : 24;
  const padding = format === "horizontal" ? 20 : 30;

  return (
    <div
      style={{
        position: "absolute",
        top: padding,
        left: padding,
        opacity,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: brandColor,
          boxShadow: `0 0 10px ${brandColor}`,
        }}
      />
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color: "white",
          letterSpacing: 1,
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        HELLO GORGEOUS
      </span>
    </div>
  );
};

const AnimatedCaption: React.FC<{
  text: string;
  delay: number;
  brandColor: string;
}> = ({ text, delay, brandColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame - delay, [0, 10, 20, 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 10 },
  });

  if (frame < delay || frame > delay + 35) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "25%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: progress,
        transform: `scale(${Math.min(scale, 1)})`,
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: "white",
          textShadow: `0 0 20px ${brandColor}, 0 4px 20px rgba(0,0,0,0.8)`,
          letterSpacing: 2,
          padding: "10px 30px",
          background: `linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const IntroScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  const glowIntensity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleSize = format === "horizontal" ? 56 : format === "square" ? 64 : 72;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlowingOrb color={brandColor} size={400} x={width * 0.1} y={height * 0.15} />
      <GlowingOrb color="#FF69B4" size={300} x={width * 0.7} y={height * 0.7} />

      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: "white",
            textShadow: `0 0 ${30 * glowIntensity}px ${brandColor}`,
            letterSpacing: 4,
          }}
        >
          HELLO
        </div>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 4,
          }}
        >
          GORGEOUS
        </div>
        <div
          style={{
            fontSize: titleSize * 0.33,
            color: "#ffffff80",
            marginTop: 20,
            letterSpacing: 8,
          }}
        >
          MED SPA
        </div>
      </div>

      <AnimatedText
        delay={60}
        style={{
          position: "absolute",
          bottom: height * 0.15,
          fontSize: 28,
          color: "white",
          letterSpacing: 4,
        }}
      >
        INTRODUCING
      </AnimatedText>
    </AbsoluteFill>
  );
};

const ProblemScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const { width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 40 : format === "square" ? 44 : 48;
  const textSize = format === "horizontal" ? 28 : format === "square" ? 32 : 36;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <GlowingOrb color={brandColor} size={200} x={width * 0.8} y={height * 0.1} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "white",
              marginBottom: 50,
            }}
          >
            Struggling with...
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
              lineHeight: 1.4,
            }}
          >
            ✕ Fine lines & wrinkles
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
              lineHeight: 1.4,
            }}
          >
            ✕ Uneven skin texture
          </div>
        </AnimatedText>

        <AnimatedText delay={45}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
              lineHeight: 1.4,
            }}
          >
            ✕ Acne scars & pores
          </div>
        </AnimatedText>

        <AnimatedText delay={60}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              lineHeight: 1.4,
            }}
          >
            ✕ Sun damage & age spots
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const { width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 52 : format === "square" ? 58 : 64;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LaserBeamEffect brandColor={brandColor} />
      <GlowingOrb color={brandColor} size={500} x={width * 0.25} y={height * 0.4} />

      <div style={{ textAlign: "center", zIndex: 10, padding: 60 }}>
        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: 28,
              color: "#FF69B4",
              marginBottom: 20,
              letterSpacing: 6,
            }}
          >
            THE SOLUTION
          </div>
        </AnimatedText>

        <AnimatedText delay={45}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              marginBottom: 10,
              textShadow: `0 0 40px ${brandColor}`,
            }}
          >
            SOLARIA
          </div>
        </AnimatedText>

        <AnimatedText delay={55}>
          <div
            style={{
              fontSize: titleSize * 0.7,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CO2 Fractional Laser
          </div>
        </AnimatedText>

        <AnimatedText delay={70}>
          <div
            style={{
              fontSize: 24,
              color: "#ffffff70",
              marginTop: 30,
              letterSpacing: 3,
            }}
          >
            by InMode
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const BenefitsScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const benefits = [
    { icon: "✨", text: "Stimulates Collagen Production" },
    { icon: "🔬", text: "Precision Fractional Technology" },
    { icon: "⏱️", text: "Minimal Downtime" },
    { icon: "💎", text: "Dramatic, Lasting Results" },
  ];

  const titleSize = format === "horizontal" ? 40 : format === "square" ? 44 : 48;
  const textSize = format === "horizontal" ? 24 : format === "square" ? 28 : 32;

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <AnimatedText delay={0}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: "white",
            marginBottom: 50,
            textAlign: "center",
          }}
        >
          Why <span style={{ color: brandColor }}>Solaria</span>?
        </div>
      </AnimatedText>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {benefits.map((benefit, index) => (
          <AnimatedText key={index} delay={15 + index * 15}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 25,
                padding: "18px 35px",
                background: "linear-gradient(90deg, #ffffff08, transparent)",
                borderRadius: 16,
                borderLeft: `4px solid ${brandColor}`,
              }}
            >
              <span style={{ fontSize: 40 }}>{benefit.icon}</span>
              <span
                style={{
                  fontSize: textSize,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {benefit.text}
              </span>
            </div>
          </AnimatedText>
        ))}
      </div>

      <AnimatedCaption text="STIMULATES COLLAGEN" delay={20} brandColor={brandColor} />
      <AnimatedCaption text="RESURFACES SKIN" delay={55} brandColor={brandColor} />
    </AbsoluteFill>
  );
};

const BeforeAfterScene: React.FC<{ brandColor: string; format: VideoFormat; imageSet: 1 | 2 }> = ({
  brandColor,
  format,
  imageSet,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const imageScale = interpolate(frame, [0, 60], [0.95, 1.02], {
    extrapolateRight: "clamp",
  });

  const rotation1 = interpolate(frame, [0, 30], [-8, -5], {
    extrapolateRight: "clamp",
  });

  const rotation2 = interpolate(frame, [15, 45], [8, 5], {
    extrapolateRight: "clamp",
  });

  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const containerWidth = format === "horizontal" ? 700 : format === "square" ? 500 : 450;
  const containerHeight = format === "horizontal" ? 450 : format === "square" ? 400 : 500;

  const imageSrc = imageSet === 1 
    ? staticFile("solaria-ba1.png")
    : staticFile("solaria-ba2.png");

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <GlowingOrb color={brandColor} size={400} x={width * 0.5 - 200} y={height * 0.3} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "white",
              marginBottom: 30,
            }}
          >
            <span style={{ color: brandColor }}>REAL</span> RESULTS
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              transform: `scale(${imageScale})`,
              position: "relative",
              width: containerWidth,
              height: containerHeight,
              margin: "0 auto",
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              fontSize: 24,
              color: "#ffffff80",
              marginTop: 30,
              lineHeight: 1.5,
            }}
          >
            Smoother, tighter skin
            <br />
            <span
              style={{
                color: brandColor,
                fontWeight: 700,
                fontSize: 30,
              }}
            >
              in just ONE treatment
            </span>
          </div>
        </AnimatedText>
      </div>

      <AnimatedCaption text="IMPROVES TEXTURE" delay={30} brandColor={brandColor} />
      <AnimatedCaption text="REDUCES WRINKLES" delay={65} brandColor={brandColor} />
    </AbsoluteFill>
  );
};

const VIPOfferScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const priceScale = spring({
    frame: frame - 30,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 8, stiffness: 100 },
  });

  const sparkle = Math.sin(frame * 0.15) * 0.1 + 1;

  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const priceSize = format === "horizontal" ? 80 : format === "square" ? 90 : 100;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <GlowingOrb color={brandColor} size={500} x={200} y={400} />
      <GlowingOrb color="#FFD700" size={300} x={700} y={200} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: 24,
              color: "#FFD700",
              letterSpacing: 6,
              marginBottom: 15,
            }}
          >
            ⭐ VIP LAUNCH SPECIAL ⭐
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "white",
              marginBottom: 30,
            }}
          >
            Full Face + Neck + Chest
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div
            style={{
              transform: `scale(${Math.max(priceScale, 0)})`,
            }}
          >
            <div
              style={{
                fontSize: priceSize,
                fontWeight: 800,
                background: `linear-gradient(90deg, ${brandColor}, #FF69B4, ${brandColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `0 0 60px ${brandColor}80`,
                transform: `scale(${sparkle})`,
              }}
            >
              $1,895
            </div>
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              marginTop: 20,
              padding: "12px 30px",
              background: "linear-gradient(90deg, #FFD70020, #FFD70040, #FFD70020)",
              borderRadius: 30,
              border: "1px solid #FFD70060",
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: "#FFD700",
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              LIMITED LAUNCH OFFER
            </span>
          </div>
        </AnimatedText>

        <AnimatedText delay={65}>
          <div
            style={{
              marginTop: 30,
              fontSize: 18,
              color: "#ffffff60",
            }}
          >
            Regular Price: <span style={{ textDecoration: "line-through" }}>$2,500</span>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.12) * 0.08 + 1;

  const titleSize = format === "horizontal" ? 44 : format === "square" ? 50 : 56;
  const textSize = format === "horizontal" ? 22 : format === "square" ? 24 : 26;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <GlowingOrb color={brandColor} size={600} x={200} y={500} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              marginBottom: 30,
            }}
          >
            HELLO GORGEOUS
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MED SPA
            </span>
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 8,
              lineHeight: 1.5,
            }}
          >
            📍 74 W Washington St
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
            }}
          >
            Oswego, IL
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: textSize + 4,
              color: "white",
              fontWeight: 600,
              marginBottom: 35,
            }}
          >
            📞 630-636-6193
          </div>
        </AnimatedText>

        <AnimatedText delay={40}>
          <div
            style={{
              transform: `scale(${pulse})`,
              padding: "25px 50px",
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              borderRadius: 50,
              fontSize: 30,
              fontWeight: 700,
              color: "white",
              marginBottom: 30,
              boxShadow: `0 10px 50px ${brandColor}90`,
              cursor: "pointer",
            }}
          >
            BOOK NOW
          </div>
        </AnimatedText>

        <AnimatedText delay={55}>
          <div
            style={{
              fontSize: textSize,
              color: brandColor,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            hellogorgeousmedspa.com
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const SolariaCO2Laser: React.FC<SolariaCO2LaserProps> = ({
  brandColor,
  accentColor,
  backgroundColor,
  format,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Background audio - uncomment when you add the audio file */}
      {/* <Audio src={staticFile("audio/beauty-spa-music.mp3")} volume={0.3} /> */}

      {/* Logo watermark throughout */}
      <LogoWatermark brandColor={brandColor} format={format} />

      {/* Scene 1: Intro - 0 to 3s (frames 0-90) */}
      <Sequence from={0} durationInFrames={120}>
        <IntroScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: Problem - 3s to 6s (frames 90-180) */}
      <Sequence from={120} durationInFrames={120}>
        <ProblemScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: Solution with laser effect - 6s to 10s (frames 180-300) */}
      <Sequence from={240} durationInFrames={150}>
        <SolutionScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: Benefits - 10s to 14s (frames 300-420) */}
      <Sequence from={390} durationInFrames={150}>
        <BenefitsScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 5a: Before/After Results Set 1 - 14s to 17s */}
      <Sequence from={540} durationInFrames={90}>
        <BeforeAfterScene brandColor={brandColor} format={format} imageSet={1} />
      </Sequence>

      {/* Scene 5b: Before/After Results Set 2 - 17s to 20s */}
      <Sequence from={630} durationInFrames={90}>
        <BeforeAfterScene brandColor={brandColor} format={format} imageSet={2} />
      </Sequence>

      {/* Scene 6: VIP Offer - 20s to 25s */}
      <Sequence from={720} durationInFrames={90}>
        <VIPOfferScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 7: CTA - 25s to 30s */}
      <Sequence from={810} durationInFrames={90}>
        <CTAScene brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
