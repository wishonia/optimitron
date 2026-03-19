import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 border-4 border-primary" />
        <Skeleton className="h-5 w-96 border-4 border-primary" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        ))}
      </div>

      {/* Main content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        ))}
      </div>

      {/* Full-width card */}
      <Skeleton className="h-48 border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
    </div>
  )
}
