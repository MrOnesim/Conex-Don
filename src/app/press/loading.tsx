"use client";

import { Suspense } from "react";

export default function Loading() {
  return (
    <Suspense fallback={<PressSkeleton />}>
      <PressSkeleton />
    </Suspense>
  );
}

function PressSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-bone/12 p-6 bg-bone/10 rounded-xl">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
              <div className="flex gap-3 mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
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