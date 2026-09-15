import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return <HistoireSkeleton />;
}

function HistoireSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-16 w-full mb-8" />
        <Skeleton className="h-6 w-3/4 mb-12" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 border-l border-gold pl-6">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-96 w-full mt-16" />
        <Skeleton className="h-48 w-full mt-8" />
      </div>
    </div>
  );
}
