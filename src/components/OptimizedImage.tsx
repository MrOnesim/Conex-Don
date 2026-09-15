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

  // Compute blur placeholder based on accent or default to gold brand placeholder
  const computedBlurDataURL =
    blurDataURL ||
    (accent ? getBlurPlaceholderForAccent(accent) : brandBlurPlaceholders.gold);

  // Default responsive sizes when using fill
  const computedSizes =
    sizes || (fill ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : undefined);

  if (hasError) {
    return (
      <div
        className={`relative flex items-center justify-center bg-bone/10 border border-bone/15 ${className}`}
        style={fill ? { width: "100%", height: "100%" } : { width, height }}
        aria-hidden="true"
      >
        <svg
          width={width ? Math.min(width, 40) : 32}
          height={height ? Math.min(height, 40) : 32}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-bone/40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
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
        className={`transition-all duration-700 ease-out ${
          isLoading ? "scale-105 blur-sm opacity-60" : "scale-100 blur-0 opacity-100"
        } ${imageClassName}`}
      />
      {isLoading && placeholder === "blur" && (
        <div
          className="absolute inset-0 bg-bone/5 backdrop-blur-[2px] animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function BlurPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative bg-bone/10 animate-pulse ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-bone/5 to-ink" />
    </div>
  );
}