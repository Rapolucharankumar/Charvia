import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3 mt-2" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow p-6">
          <Skeleton className="h-[350px] w-full" />
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex items-center gap-4">
               <Skeleton className="h-12 w-12 rounded-full" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-3 w-2/3" />
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
