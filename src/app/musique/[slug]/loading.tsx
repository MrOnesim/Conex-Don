"use client";

import { Suspense } from "react";

export default function Loading() {
  return (
    <Suspense fallback={<ReleaseSkeleton />}>
      <ReleaseSkeleton />
    </Suspense>
  );
}

function ReleaseSkeleton() {
  return (
    <article className="pt-24 sm:pt-32 min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg mt-14" />
        <div className="mt-14 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3 p-4 bg-bone/10 rounded-lg">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} animate-pulse bg-bone/10 rounded`} aria-hidden="true" />
  );
}