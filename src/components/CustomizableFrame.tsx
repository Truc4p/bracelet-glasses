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
    const opacity = Math.max(0.1, Math.min(0.9, 1 - vlt / 100));
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
          mixBlendMode: "darken",
          clipPath: "polygon(20% 15%, 80% 15%, 80% 75%, 20% 75%)",
          transform,
        }}
      />
    </div>
  );
};
