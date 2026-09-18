"use client";

import type { ReactNode } from "react";

import { SoftEnter } from "@/components/motion";

export function EmptyState({
  eyebrow = "Rien à afficher",
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <SoftEnter className={`empty-state ${compact ? "empty-state--compact" : ""}`}>
      <div className="empty-state__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h3 className="display-xl empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </SoftEnter>
  );
}
