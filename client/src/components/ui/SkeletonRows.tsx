interface Props {
  count: number;
  cols: number;
}

export const SkeletonRows = ({ count, cols }: Props) => (
  <div className="card overflow-hidden">
    {/* Header skeleton */}
    <div className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
      <div className="flex gap-4 px-5 py-3.5">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-3 w-20 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
        ))}
      </div>
    </div>
    {/* Row skeletons */}
    {Array.from({ length: count }).map((_, rowIdx) => (
      <div
        key={rowIdx}
        className="flex gap-4 px-5 py-4 border-b border-surface-100 dark:border-surface-800/50 last:border-0"
      >
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div key={colIdx} className="flex-1">
            <div
              className="h-4 rounded bg-surface-100 dark:bg-surface-800 animate-pulse"
              style={{
                width: `${50 + Math.random() * 40}%`,
                animationDelay: `${rowIdx * 50 + colIdx * 100}ms`,
              }}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);
