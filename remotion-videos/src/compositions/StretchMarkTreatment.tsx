import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface StretchMarkTreatmentProps {
  brandColor?: string;
  format?: VideoFormat;
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
    from: 40,
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

// Scene 1: Hook - Grab Attention
const HookScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 10 },
  });

  const titleSize = format === "horizontal" ? 48 : format === "square" ? 54 : 60;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlowingOrb color={brandColor} size={400} x={width * 0.1} y={height * 0.2} />
      <GlowingOrb color="#FF69B4" size={300} x={width * 0.7} y={height * 0.6} />

      <div style={{ textAlign: "center", zIndex: 10, padding: 40 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize * 0.5,
              color: "#FF69B4",
              letterSpacing: 4,
              marginBottom: 20,
            }}
          >
            STRETCH MARKS?
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              transform: `scale(${titleScale})`,
              textShadow: `0 0 40px ${brandColor}`,
              lineHeight: 1.2,
            }}
          >
            This is NOT
            <br />
            <span style={{ color: brandColor }}>Camouflage</span>
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              fontSize: titleSize * 0.6,
              fontWeight: 700,
              color: "white",
              marginTop: 30,
            }}
          >
            This is{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              COLLAGEN RECONSTRUCTION
            </span>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Problem Statement
const ProblemScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const { width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const textSize = format === "horizontal" ? 24 : format === "square" ? 28 : 32;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
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
              marginBottom: 40,
            }}
          >
            Why Creams Don&apos;t Work
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
              lineHeight: 1.5,
            }}
          >
            Stretch marks are a{" "}
            <span style={{ color: brandColor, fontWeight: 600 }}>
              structural change
            </span>
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 25,
              lineHeight: 1.5,
            }}
          >
            in the skin — not a surface flaw
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              fontSize: textSize * 1.1,
              color: "white",
              fontWeight: 600,
              padding: "15px 30px",
              background: `linear-gradient(90deg, ${brandColor}30, transparent)`,
              borderLeft: `4px solid ${brandColor}`,
              marginTop: 30,
            }}
          >
            You need DEEP treatment
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Solution - Solaria CO2
const SolutionScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 48 : format === "square" ? 54 : 60;

  const laserGlow = Math.sin(frame * 0.1) * 0.3 + 1;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlowingOrb color={brandColor} size={500} x={width * 0.25} y={height * 0.4} />

      <div style={{ textAlign: "center", zIndex: 10, padding: 50 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: 24,
              color: "#FF69B4",
              letterSpacing: 6,
              marginBottom: 15,
            }}
          >
            THE SOLUTION
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              textShadow: `0 0 ${40 * laserGlow}px ${brandColor}`,
            }}
          >
            SOLARIA
          </div>
        </AnimatedText>

        <AnimatedText delay={35}>
          <div
            style={{
              fontSize: titleSize * 0.6,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}
          >
            CO₂ Fractional Laser
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              fontSize: 22,
              color: "#ffffff70",
              letterSpacing: 3,
            }}
          >
            Premium Body Resurfacing
          </div>
        </AnimatedText>

        <AnimatedText delay={65}>
          <div
            style={{
              marginTop: 40,
              fontSize: 18,
              color: "#ffffff50",
            }}
          >
            by InMode
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: How It Works
const HowItWorksScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const textSize = format === "horizontal" ? 22 : format === "square" ? 24 : 26;

  const steps = [
    { icon: "🔬", text: "Penetrates deep into dermis" },
    { icon: "✨", text: "Stimulates collagen remodeling" },
    { icon: "💪", text: "Improves skin thickness" },
    { icon: "🎯", text: "Refines texture permanently" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <AnimatedText delay={0}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: "white",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          How <span style={{ color: brandColor }}>Solaria</span> Works
        </div>
      </AnimatedText>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((step, index) => (
          <AnimatedText key={index} delay={15 + index * 15}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "15px 30px",
                background: "linear-gradient(90deg, #ffffff08, transparent)",
                borderRadius: 12,
                borderLeft: `4px solid ${brandColor}`,
              }}
            >
              <span style={{ fontSize: 36 }}>{step.icon}</span>
              <span
                style={{
                  fontSize: textSize,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {step.text}
              </span>
            </div>
          </AnimatedText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Ideal Candidates
const IdealForScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const textSize = format === "horizontal" ? 22 : format === "square" ? 24 : 26;

  const candidates = [
    { icon: "🏋️", text: "Fitness Competitors" },
    { icon: "⚡", text: "Post-Weight Loss" },
    { icon: "🤰", text: "Postpartum Moms" },
    { icon: "💎", text: "Body Contouring Clients" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <AnimatedText delay={0}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: "white",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Ideal For
        </div>
      </AnimatedText>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {candidates.map((item, index) => (
          <AnimatedText key={index} delay={15 + index * 12}>
            <div
              style={{
                textAlign: "center",
                padding: "25px 20px",
                background: `linear-gradient(180deg, ${brandColor}15, transparent)`,
                borderRadius: 16,
                border: `1px solid ${brandColor}40`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 10 }}>{item.icon}</div>
              <div
                style={{
                  fontSize: textSize,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {item.text}
              </div>
            </div>
          </AnimatedText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Results
// Scene: Before/After with Real Images
const BeforeAfterScene: React.FC<{ 
  brandColor: string; 
  format: VideoFormat;
  imageFile: string;
  caption: string;
}> = ({
  brandColor,
  format,
  imageFile,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;

  const imageScale = spring({
    frame: frame - 15,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 12 },
  });

  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: format === "horizontal" ? 40 : 30,
      }}
    >
      <GlowingOrb color={brandColor} size={300} x={width * 0.1} y={height * 0.2} />
      
      <div style={{ textAlign: "center", zIndex: 10, width: "100%" }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "white",
              marginBottom: 20,
            }}
          >
            <span style={{ color: brandColor }}>REAL</span> RESULTS
          </div>
        </AnimatedText>

        <div
          style={{
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
            margin: "0 auto",
            maxWidth: format === "horizontal" ? "70%" : "90%",
          }}
        >
          <Img
            src={staticFile(imageFile)}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 16,
              boxShadow: `0 10px 40px ${brandColor}40`,
            }}
          />
        </div>

        <AnimatedText delay={40}>
          <div
            style={{
              fontSize: titleSize * 0.5,
              color: "#ffffff90",
              marginTop: 20,
              fontWeight: 500,
            }}
          >
            {caption}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const ResultsScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSize = format === "horizontal" ? 44 : format === "square" ? 50 : 56;

  const percentScale = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: 24,
              color: "#FF69B4",
              letterSpacing: 6,
              marginBottom: 20,
            }}
          >
            EXPECTED RESULTS
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div
            style={{
              transform: `scale(${Math.max(percentScale, 0)})`,
            }}
          >
            <div
              style={{
                fontSize: titleSize * 1.8,
                fontWeight: 800,
                background: `linear-gradient(90deg, ${brandColor}, #FF69B4, ${brandColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `0 0 60px ${brandColor}80`,
              }}
            >
              40-70%
            </div>
          </div>
        </AnimatedText>

        <AnimatedText delay={45}>
          <div
            style={{
              fontSize: titleSize * 0.6,
              color: "white",
              marginTop: 20,
              fontWeight: 600,
            }}
          >
            Visible Improvement
          </div>
        </AnimatedText>

        <AnimatedText delay={60}>
          <div
            style={{
              fontSize: 22,
              color: "#ffffff70",
              marginTop: 30,
            }}
          >
            After a treatment series
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: CTA
const CTAScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.12) * 0.08 + 1;

  const titleSize = format === "horizontal" ? 40 : format === "square" ? 46 : 52;
  const textSize = format === "horizontal" ? 20 : format === "square" ? 22 : 24;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: 20,
              color: "#FF69B4",
              letterSpacing: 4,
              marginBottom: 15,
            }}
          >
            RESTORE YOUR CONFIDENCE
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              marginBottom: 25,
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

        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: textSize,
              color: "#ffffff90",
              marginBottom: 8,
            }}
          >
            📍 74 W Washington St, Oswego, IL
          </div>
        </AnimatedText>

        <AnimatedText delay={40}>
          <div
            style={{
              fontSize: textSize + 2,
              color: "white",
              fontWeight: 600,
              marginBottom: 30,
            }}
          >
            📞 630-636-6193
          </div>
        </AnimatedText>

        <AnimatedText delay={50}>
          <div
            style={{
              transform: `scale(${pulse})`,
              padding: "20px 45px",
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              borderRadius: 50,
              fontSize: 26,
              fontWeight: 700,
              color: "white",
              marginBottom: 25,
              boxShadow: `0 10px 50px ${brandColor}90`,
            }}
          >
            BOOK CONSULTATION
          </div>
        </AnimatedText>

        <AnimatedText delay={65}>
          <div
            style={{
              fontSize: textSize,
              color: brandColor,
              fontWeight: 600,
            }}
          >
            hellogorgeousmedspa.com
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const StretchMarkTreatment: React.FC<StretchMarkTreatmentProps> = ({
  brandColor = "#E91E8C",
  format = "vertical",
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Logo watermark throughout */}
      <LogoWatermark brandColor={brandColor} format={format} />

      {/* Scene 1: Hook - 0 to 3s (frames 0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: Problem - 3s to 6s (frames 90-180) */}
      <Sequence from={90} durationInFrames={90}>
        <ProblemScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: Solution - 6s to 9s (frames 180-270) */}
      <Sequence from={180} durationInFrames={90}>
        <SolutionScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: How It Works - 9s to 13s (frames 270-390) */}
      <Sequence from={270} durationInFrames={120}>
        <HowItWorksScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 5: Ideal For - 13s to 16s (frames 390-480) */}
      <Sequence from={390} durationInFrames={90}>
        <IdealForScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 6a: Before/After - Stretch Marks (frames 480-570) */}
      <Sequence from={480} durationInFrames={90}>
        <BeforeAfterScene 
          brandColor={brandColor} 
          format={format}
          imageFile="stretch-marks-acne-scars.png"
          caption="Stretch marks & acne scars"
        />
      </Sequence>

      {/* Scene 6b: Before/After - Stretch Mark Comparison (frames 570-660) */}
      <Sequence from={570} durationInFrames={90}>
        <BeforeAfterScene 
          brandColor={brandColor} 
          format={format}
          imageFile="stretch-mark-comparison.png"
          caption="Stretch mark refinement"
        />
      </Sequence>

      {/* Scene 7: Results Stats - 22s to 25s (frames 660-750) */}
      <Sequence from={660} durationInFrames={90}>
        <ResultsScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 8: CTA - 25s to 30s (frames 750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <CTAScene brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
