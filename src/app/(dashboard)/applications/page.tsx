import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { KanbanBoardWrapper } from "./kanban-wrapper";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Application Tracker</h2>
          <p className="text-muted-foreground">
            Manage and visualize your job search pipeline.
          </p>
        </div>
      </div>

      <KanbanBoardWrapper initialData={applications} />
    </div>
  );
}
