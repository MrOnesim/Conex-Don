import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-[16vw] max-h-40 w-4/5" />
        <Skeleton className="mt-8 h-5 w-full max-w-xl" />
        <div className="mt-16 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="bg-ink p-6">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="mt-5 h-7 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
              <Skeleton className="mt-5 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
