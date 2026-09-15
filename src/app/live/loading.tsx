import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return <LiveSkeleton />;
}

function LiveSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-bone/12 p-6 lg:p-8">
              <div className="flex flex-wrap gap-3 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
