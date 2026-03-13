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

export type VideoFormat = "vertical" | "square" | "horizontal";

export interface ServicePromoProps {
  serviceName: string;
  headline: string;
  subheadline?: string;
  price: string;
  originalPrice?: string;
  promoLabel?: string;
  benefits: string[];
  beforeImage?: string;
  afterImage?: string;
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  brandColor: string;
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

const LogoWatermark: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  const fontSize = format === "horizontal" ? 18 : format === "square" ? 20 : 24;

  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 30,
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

const IntroScene: React.FC<{
  serviceName: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ serviceName, brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  const titleSize = format === "horizontal" ? 56 : format === "square" ? 64 : 72;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlowingOrb color={brandColor} size={400} x={width * 0.1} y={height * 0.15} />
      <GlowingOrb color="#FF69B4" size={300} x={width * 0.7} y={height * 0.7} />

      <div style={{ transform: `scale(${logoScale})`, textAlign: "center", zIndex: 10 }}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: "white",
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

const ServiceRevealScene: React.FC<{
  serviceName: string;
  headline: string;
  subheadline?: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ serviceName, headline, subheadline, brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const titleSize = format === "horizontal" ? 52 : format === "square" ? 58 : 64;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GlowingOrb color={brandColor} size={500} x={width * 0.25} y={height * 0.4} />

      <div style={{ textAlign: "center", zIndex: 10, padding: 60 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "white",
              marginBottom: 20,
              textShadow: `0 0 40px ${brandColor}`,
              lineHeight: 1.2,
            }}
          >
            {serviceName.toUpperCase()}
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div
            style={{
              fontSize: titleSize * 0.55,
              fontWeight: 600,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {headline}
          </div>
        </AnimatedText>

        {subheadline && (
          <AnimatedText delay={35}>
            <div
              style={{
                fontSize: 24,
                color: "#ffffff70",
                marginTop: 20,
                letterSpacing: 2,
              }}
            >
              {subheadline}
            </div>
          </AnimatedText>
        )}
      </div>
    </AbsoluteFill>
  );
};

const BenefitsScene: React.FC<{
  benefits: string[];
  brandColor: string;
  format: VideoFormat;
}> = ({ benefits, brandColor, format }) => {
  const titleSize = format === "horizontal" ? 40 : format === "square" ? 44 : 48;
  const textSize = format === "horizontal" ? 24 : format === "square" ? 28 : 32;

  const icons = ["✨", "🔬", "⏱️", "💎", "🌟", "💪"];

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
          Why Choose <span style={{ color: brandColor }}>Us</span>?
        </div>
      </AnimatedText>

      <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
        {benefits.slice(0, 4).map((benefit, index) => (
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
              <span style={{ fontSize: 36 }}>{icons[index % icons.length]}</span>
              <span style={{ fontSize: textSize, color: "white", fontWeight: 500 }}>
                {benefit}
              </span>
            </div>
          </AnimatedText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BeforeAfterScene: React.FC<{
  beforeImage?: string;
  afterImage?: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ beforeImage, afterImage, brandColor, format }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const imageScale = interpolate(frame, [0, 60], [0.95, 1.02], {
    extrapolateRight: "clamp",
  });

  const titleSize = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const containerWidth = format === "horizontal" ? 700 : format === "square" ? 500 : 450;
  const containerHeight = format === "horizontal" ? 450 : format === "square" ? 400 : 500;

  if (!beforeImage && !afterImage) {
    return (
      <AbsoluteFill
        style={{
          background: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowingOrb color={brandColor} size={400} x={width * 0.5 - 200} y={height * 0.3} />
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <AnimatedText delay={0}>
            <div style={{ fontSize: titleSize, fontWeight: 700, color: "white" }}>
              <span style={{ color: brandColor }}>REAL</span> RESULTS
            </div>
          </AnimatedText>
          <AnimatedText delay={20}>
            <div
              style={{
                fontSize: 28,
                color: "#ffffff80",
                marginTop: 30,
              }}
            >
              Amazing transformations await
            </div>
          </AnimatedText>
        </div>
      </AbsoluteFill>
    );
  }

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
          <div style={{ fontSize: titleSize, fontWeight: 700, color: "white", marginBottom: 30 }}>
            <span style={{ color: brandColor }}>REAL</span> RESULTS
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div style={{ transform: `scale(${imageScale})` }}>
            {beforeImage && (
              <Img
                src={staticFile(beforeImage)}
                style={{
                  width: containerWidth,
                  height: containerHeight,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            )}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const PromoScene: React.FC<{
  price: string;
  originalPrice?: string;
  promoLabel?: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ price, originalPrice, promoLabel, brandColor, format }) => {
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
        {promoLabel && (
          <AnimatedText delay={0}>
            <div
              style={{
                fontSize: 24,
                color: "#FFD700",
                letterSpacing: 6,
                marginBottom: 20,
              }}
            >
              ⭐ {promoLabel.toUpperCase()} ⭐
            </div>
          </AnimatedText>
        )}

        <AnimatedText delay={15}>
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
              {price}
            </div>
          </div>
        </AnimatedText>

        {originalPrice && (
          <AnimatedText delay={40}>
            <div style={{ marginTop: 15, fontSize: 22, color: "#ffffff60" }}>
              Regular: <span style={{ textDecoration: "line-through" }}>{originalPrice}</span>
            </div>
          </AnimatedText>
        )}

        <AnimatedText delay={50}>
          <div
            style={{
              marginTop: 25,
              padding: "12px 30px",
              background: "linear-gradient(90deg, #FFD70020, #FFD70040, #FFD70020)",
              borderRadius: 30,
              border: "1px solid #FFD70060",
            }}
          >
            <span style={{ fontSize: 20, color: "#FFD700", fontWeight: 600, letterSpacing: 2 }}>
              LIMITED TIME OFFER
            </span>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ clinicName, address, city, phone, website, brandColor, format }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.12) * 0.08 + 1;

  const titleSize = format === "horizontal" ? 44 : format === "square" ? 50 : 56;
  const textSize = format === "horizontal" ? 22 : format === "square" ? 24 : 26;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <GlowingOrb color={brandColor} size={600} x={200} y={500} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: titleSize, fontWeight: 800, color: "white", marginBottom: 30 }}>
            {clinicName.split(" ").slice(0, 2).join(" ")}
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {clinicName.split(" ").slice(2).join(" ") || "MED SPA"}
            </span>
          </div>
        </AnimatedText>

        <AnimatedText delay={15}>
          <div style={{ fontSize: textSize, color: "#ffffff90", marginBottom: 8 }}>
            📍 {address}
          </div>
        </AnimatedText>

        <AnimatedText delay={20}>
          <div style={{ fontSize: textSize, color: "#ffffff90", marginBottom: 25 }}>
            {city}
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div style={{ fontSize: textSize + 4, color: "white", fontWeight: 600, marginBottom: 35 }}>
            📞 {phone}
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
            }}
          >
            BOOK NOW
          </div>
        </AnimatedText>

        <AnimatedText delay={55}>
          <div style={{ fontSize: textSize, color: brandColor, fontWeight: 600, letterSpacing: 1 }}>
            {website}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const ServicePromo: React.FC<ServicePromoProps> = ({
  serviceName,
  headline,
  subheadline,
  price,
  originalPrice,
  promoLabel,
  benefits,
  beforeImage,
  afterImage,
  clinicName,
  address,
  city,
  phone,
  website,
  brandColor,
  format,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <LogoWatermark brandColor={brandColor} format={format} />

      {/* Scene 1: Intro (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene serviceName={serviceName} brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: Service Reveal (3-7s) */}
      <Sequence from={90} durationInFrames={120}>
        <ServiceRevealScene
          serviceName={serviceName}
          headline={headline}
          subheadline={subheadline}
          brandColor={brandColor}
          format={format}
        />
      </Sequence>

      {/* Scene 3: Benefits (7-12s) */}
      <Sequence from={210} durationInFrames={150}>
        <BenefitsScene benefits={benefits} brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: Before/After (12-17s) */}
      <Sequence from={360} durationInFrames={150}>
        <BeforeAfterScene
          beforeImage={beforeImage}
          afterImage={afterImage}
          brandColor={brandColor}
          format={format}
        />
      </Sequence>

      {/* Scene 5: Promo/Price (17-22s) */}
      <Sequence from={510} durationInFrames={150}>
        <PromoScene
          price={price}
          originalPrice={originalPrice}
          promoLabel={promoLabel}
          brandColor={brandColor}
          format={format}
        />
      </Sequence>

      {/* Scene 6: CTA (22-30s) */}
      <Sequence from={660} durationInFrames={240}>
        <CTAScene
          clinicName={clinicName}
          address={address}
          city={city}
          phone={phone}
          website={website}
          brandColor={brandColor}
          format={format}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
