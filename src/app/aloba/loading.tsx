import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return <AlobaSkeleton />;
}

function AlobaSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <Skeleton className="h-12 w-32 mb-6" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <div className="flex flex-wrap gap-3 mb-12">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-t border-bone/12 py-5">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
