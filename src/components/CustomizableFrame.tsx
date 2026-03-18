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
  console.log('CustomizableFrame render:', { imageSrc, alt, vlt, tintColor, gradientMode, secondaryColor });

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
        border: '2px solid red',
      }}
    >
      <div className="text-black mb-2">Image: {imageSrc}</div>
      <div
        className="relative overflow-hidden w-full"
        style={{
          height: '0',
          paddingBottom: '56%',
          border: '2px solid blue',
        }}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="absolute w-full h-full object-contain drop-shadow-2xl"
          style={{
            transform,
            top: '0',
            left: '0',
          }}
          onLoad={() => console.log('Image loaded:', imageSrc)}
          onError={(e) => console.error('Image failed to load:', imageSrc, e)}
        />

        {/* Tint overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: gradientMode
              ? `linear-gradient(180deg, ${tintColor} 0%, ${secondaryColor} 100%)`
              : tintColor,
            opacity: getLensOpacity(),
            mixBlendMode: 'multiply',
            transform,
          }}
        />
      </div>
    </div>
  );
};
