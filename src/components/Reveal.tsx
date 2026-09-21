"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "wipe" | "mask" | "fade";
  as?: ElementType;
  style?: CSSProperties;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "rise",
  as,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = (as ?? "div") as any;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "wipe" ? "wipe" : variant === "mask" ? "reveal-mask" : variant === "fade" ? "reveal-fade" : "rise";

  return (
    <Tag
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={`${variantClass} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/** Révélation mot à mot — pour les grandes phrases éditoriales. */
export function RevealWords({
  text,
  className = "",
  delay = 0,
  step = 45,
  as,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = (as ?? "p") as any;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: visible ? "translateY(0)" : "translateY(105%)",
              transitionDelay: `${delay + index * step}ms`,
            }}
          >
            {word}
          </span>
          {index < text.split(" ").length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
