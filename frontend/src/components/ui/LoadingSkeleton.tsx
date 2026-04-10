interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ count = 4, className = 'h-64' }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`bg-surface-container-low p-6 animate-pulse ${className}`} />
      ))}
    </div>
  );
}
