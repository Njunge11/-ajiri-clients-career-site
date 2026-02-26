import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailLoading() {
  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8">
        {/* Back link */}
        <Skeleton className="h-5 w-32 mb-8" />

        <div className="@5xl:grid @5xl:grid-cols-12 @5xl:gap-16">
          {/* Left column — sidebar */}
          <div className="@5xl:col-span-4 mb-10 @5xl:mb-0">
            <div className="@5xl:sticky @5xl:top-32">
              {/* Title */}
              <Skeleton className="h-12 w-72 mb-3" />
              <Skeleton className="h-12 w-48 mb-6" />

              {/* Meta: department, location, work type */}
              <div className="space-y-4 mb-8">
                <Skeleton className="h-7 w-36 rounded-full" />
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-5 w-28" />
              </div>

              {/* Apply button */}
              <Skeleton className="h-14 w-full @2xl:w-64 @5xl:w-full" />
            </div>
          </div>

          {/* Right column — description */}
          <div className="@5xl:col-span-8 space-y-4">
            {/* About the role */}
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            {/* Responsibilities */}
            <div className="pt-4" />
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />

            {/* Requirements */}
            <div className="pt-4" />
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />

            {/* Benefits */}
            <div className="pt-4" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
