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
  tintColor,
  gradientMode,
  secondaryColor,
  maxWidth = "800px",
  transform,
  className = "",
}) => {
  const getLensOpacity = () => {
    return Math.max(0.3, Math.min(0.8, 1 - vlt / 100));
  };

  const getLensFill = () => {
    if (gradientMode) {
      return (
        <linearGradient id="lensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: tintColor, stopOpacity: getLensOpacity() }} />
          <stop offset="100%" style={{ stopColor: secondaryColor, stopOpacity: getLensOpacity() * 0.6 }} />
        </linearGradient>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        maxWidth,
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-auto drop-shadow-2xl"
        style={{
          transform,
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ transform }}
      >
        <defs>
          {getLensFill()}
          <radialGradient id="lensHighlight">
            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.25 }} />
            <stop offset="70%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Left lens */}
        <ellipse
          cx="30"
          cy="42"
          rx="18"
          ry="22"
          fill={gradientMode ? "url(#lensGradient)" : tintColor}
          opacity={gradientMode ? 1 : getLensOpacity()}
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Right lens */}
        <ellipse
          cx="70"
          cy="42"
          rx="18"
          ry="22"
          fill={gradientMode ? "url(#lensGradient)" : tintColor}
          opacity={gradientMode ? 1 : getLensOpacity()}
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Highlights on left lens */}
        <ellipse
          cx="27"
          cy="38"
          rx="6"
          ry="8"
          fill="url(#lensHighlight)"
        />

        {/* Highlights on right lens */}
        <ellipse
          cx="67"
          cy="38"
          rx="6"
          ry="8"
          fill="url(#lensHighlight)"
        />
      </svg>
    </div>
  );
};
