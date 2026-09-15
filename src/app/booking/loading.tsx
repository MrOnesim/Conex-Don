import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return <BookingSkeleton />;
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
