import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return <EpkSkeleton />;
}

function EpkSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3 p-6 border border-bone/12">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
