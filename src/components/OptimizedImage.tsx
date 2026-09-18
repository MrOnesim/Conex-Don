"use client";

import Image from "next/image";
import { useState } from "react";

import {
  brandBlurPlaceholders,
  getBlurPlaceholderForAccent,
} from "@/lib/image-placeholders";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  blurDataURL?: string;
  accent?: string;
  placeholder?: "blur" | "empty";
  quality?: number;
}

/**
 * Consistent progressive image treatment. The sharp image settles over a
 * structural shimmer; failed media keeps its allocated space so no layout
 * jumps occur in grids or editorial pages.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  sizes,
  className = "",
  imageClassName = "",
  blurDataURL,
  accent,
  placeholder = "blur",
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const computedBlurDataURL =
    blurDataURL ||
    (accent ? getBlurPlaceholderForAccent(accent) : brandBlurPlaceholders.gold);
  const computedSizes =
    sizes ||
    (fill
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : undefined);

  if (hasError) {
    return (
      <div
        className={`image-fallback ${className}`}
        style={fill ? { width: "100%", height: "100%" } : { width, height }}
        aria-hidden="true"
      >
        <svg
          width={width ? Math.min(width, 34) : 30}
          height={height ? Math.min(height, 34) : 30}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
        >
          <rect x="3" y="3" width="18" height="18" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m4 18 5.4-5.4 3.2 3.2 2.2-2.2L20 19" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`image-shell ${className}`}
      data-loaded={isLoading ? "false" : "true"}
      style={fill ? { width: "100%", height: "100%" } : { width, height }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={computedSizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={computedBlurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`transition-[filter,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoading
            ? "scale-[1.025] blur-sm opacity-60"
            : "scale-100 blur-0 opacity-100"
        } ${imageClassName}`}
      />
      {isLoading && placeholder === "blur" ? (
        <div className="image-shell__loading" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export function BlurPlaceholder({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
