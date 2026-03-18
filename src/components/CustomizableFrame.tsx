import React from "react";

interface CustomizableFrameProps {
  imageSrc: string;
  alt: string;
  vlt: number;
  baseColor: string;
  tintColor: string;
  gradientMode: boolean;
  secondaryColor: string;
  maxWidth?: string;
  transform?: string;
  className?: string;
}

export const CustomizableFrame: React.FC<CustomizableFrameProps> = ({
  imageSrc,
  alt,
  vlt,
  baseColor,
  tintColor,
  gradientMode,
  secondaryColor,
  maxWidth = "800px",
  transform,
  className = "",
}) => {
  const getLensFilter = () => {
    const opacity = Math.max(0.2, Math.min(0.85, 1 - vlt / 100));
    const finalColor = tintColor === "transparent" ? baseColor : tintColor;

    if (gradientMode) {
      const topColor = tintColor === "transparent" ? baseColor : tintColor;
      const bottomColor = secondaryColor === "transparent" ? baseColor : secondaryColor;
      return {
        background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
        opacity: opacity,
      };
    }

    return {
      backgroundColor: finalColor,
      opacity: opacity,
    };
  };

  const lensAreaMask = `
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <ellipse cx="30" cy="42" rx="18" ry="20" fill="white"/>
      <ellipse cx="70" cy="42" rx="18" ry="20" fill="white"/>
    </svg>
  `;

  const maskDataUrl = `data:image/svg+xml;base64,${btoa(lensAreaMask)}`;

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-auto drop-shadow-2xl relative z-10"
        style={{ maxWidth, transform }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          ...getLensFilter(),
          mixBlendMode: "multiply",
          WebkitMaskImage: `url("${maskDataUrl}")`,
          maskImage: `url("${maskDataUrl}")`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transform,
        }}
      />
    </div>
  );
};
