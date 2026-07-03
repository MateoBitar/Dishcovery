// imageWithFallback.tsx
import React, { useState } from "react";
import fallbackImage from "../../../assets/main.png";

// Props for ImageWithFallback component
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

// ImageWithFallback component
export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps): React.ReactElement {
  const [imgSrc, setImgSrc] = useState<string>(src);

  const handleError = (): void => {
    setImgSrc(fallbackImage);
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
}
