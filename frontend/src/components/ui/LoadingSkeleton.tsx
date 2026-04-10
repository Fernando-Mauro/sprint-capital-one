interface LoadingSkeletonProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-surface-container-low p-6 border-l-8 border-surface-container-highest animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-5 w-20 bg-surface-container-highest rounded" />
        <div className="h-4 w-24 bg-surface-container-highest rounded" />
      </div>
      <div className="h-8 w-3/4 bg-surface-container-highest rounded" />
      <div className="space-y-2">
        <div className="h-4 w-40 bg-surface-container-highest rounded" />
        <div className="h-4 w-32 bg-surface-container-highest rounded" />
      </div>
      <div className="pt-4 space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-28 bg-surface-container-highest rounded" />
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
