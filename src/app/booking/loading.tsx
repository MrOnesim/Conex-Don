"use client";

import { Suspense } from "react";

export default function Loading() {
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingSkeleton />
    </Suspense>
  );
}

function BookingSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <Skeleton className="h-10 w-2/3 mb-8" />
        <div className="max-w-xl space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} animate-pulse bg-bone/10 rounded`} aria-hidden="true" />
  );
}