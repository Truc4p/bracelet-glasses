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
  const getTintStyle = () => {
    const opacity = Math.max(0.4, Math.min(0.9, 1 - vlt / 100));

    if (gradientMode) {
      return {
        background: `linear-gradient(180deg, ${tintColor} 0%, ${secondaryColor} 100%)`,
        opacity: opacity,
        mixBlendMode: 'multiply' as const,
      };
    }

    return {
      backgroundColor: tintColor,
      opacity: opacity,
      mixBlendMode: 'multiply' as const,
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
    <div
      className={`relative ${className}`}
      style={{
        isolation: 'isolate',
        backgroundColor: 'white',
        maxWidth,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...getTintStyle(),
          WebkitMaskImage: `url("${maskDataUrl}")`,
          maskImage: `url("${maskDataUrl}")`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transform,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
          WebkitMaskImage: `url("${maskDataUrl}")`,
          maskImage: `url("${maskDataUrl}")`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transform,
          zIndex: 3,
        }}
      />
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-auto drop-shadow-2xl relative"
        style={{
          transform,
          mixBlendMode: "multiply",
          zIndex: 2,
          position: 'relative',
        }}
      />
    </div>
  );
};
