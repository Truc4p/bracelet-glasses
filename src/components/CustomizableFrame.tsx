import React, { useEffect, useState } from "react";

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
  const [frameOnlyUrl, setFrameOnlyUrl] = useState<string>("");
  const [lensMaskUrl, setLensMaskUrl] = useState<string>("");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const lensMaskCanvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const maskCtx = lensMaskCanvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      lensMaskCanvas.width = img.width;
      lensMaskCanvas.height = img.height;

      if (!ctx || !maskCtx) return;

      ctx.drawImage(img, 0, 0);
      maskCtx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const mask = maskData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness < 120) {
          data[i + 3] = 0;
          mask[i] = 0;
          mask[i + 1] = 0;
          mask[i + 2] = 0;
          mask[i + 3] = 255;
        } else {
          mask[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      maskCtx.putImageData(maskData, 0, 0);

      setFrameOnlyUrl(canvas.toDataURL());
      setLensMaskUrl(lensMaskCanvas.toDataURL());
    };
  }, [imageSrc]);

  const getTintStyle = () => {
    const opacity = Math.max(0.5, Math.min(0.95, 1 - vlt / 100));

    if (gradientMode) {
      return {
        background: `linear-gradient(180deg, ${tintColor} 0%, ${secondaryColor} 100%)`,
        opacity: opacity,
      };
    }

    return {
      backgroundColor: tintColor,
      opacity: opacity,
    };
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        maxWidth,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...getTintStyle(),
          WebkitMaskImage: `url("${lensMaskUrl}")`,
          maskImage: `url("${lensMaskUrl}")`,
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
          background: 'radial-gradient(ellipse 15% 20% at 30% 45%, rgba(255,255,255,0.5) 0%, transparent 70%), radial-gradient(ellipse 15% 20% at 70% 45%, rgba(255,255,255,0.5) 0%, transparent 70%)',
          WebkitMaskImage: `url("${lensMaskUrl}")`,
          maskImage: `url("${lensMaskUrl}")`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transform,
          zIndex: 2,
        }}
      />
      <img
        src={frameOnlyUrl}
        alt={alt}
        className="w-full h-auto drop-shadow-2xl relative"
        style={{
          transform,
          zIndex: 3,
          position: 'relative',
        }}
      />
    </div>
  );
};
