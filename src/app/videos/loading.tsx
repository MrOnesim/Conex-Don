"use client";

import { Suspense } from "react";

export default function Loading() {
  return (
    <Suspense fallback={<VideosSkeleton />}>
      <VideosSkeleton />
    </Suspense>
  );
}

function VideosSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3 group">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-48 mt-10 mx-auto" />
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} animate-pulse bg-bone/10 rounded`} aria-hidden="true" />
  );
}