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
      <div
        className="relative overflow-hidden w-full"
        style={{
          height: '0',
          paddingBottom: '35%',
        }}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="absolute w-full h-auto drop-shadow-2xl"
          style={{
            transform,
            top: '0',
            left: '0',
            objectFit: 'cover',
            objectPosition: 'top',
            height: '70%',
          }}
        />
      </div>

      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        style={{
          transform,
          height: '100%',
        }}
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
          cy="25"
          rx="18"
          ry="18"
          fill={gradientMode ? "url(#lensGradient)" : tintColor}
          opacity={gradientMode ? 1 : getLensOpacity()}
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Right lens */}
        <ellipse
          cx="70"
          cy="25"
          rx="18"
          ry="18"
          fill={gradientMode ? "url(#lensGradient)" : tintColor}
          opacity={gradientMode ? 1 : getLensOpacity()}
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Highlights on left lens */}
        <ellipse
          cx="27"
          cy="22"
          rx="6"
          ry="7"
          fill="url(#lensHighlight)"
        />

        {/* Highlights on right lens */}
        <ellipse
          cx="67"
          cy="22"
          rx="6"
          ry="7"
          fill="url(#lensHighlight)"
        />
      </svg>
    </div>
  );
};
