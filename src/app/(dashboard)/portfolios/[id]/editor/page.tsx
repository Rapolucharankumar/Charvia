import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PortfolioEditor } from "./PortfolioEditor";

export default async function PortfolioEditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: params.id, userId: user.id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!portfolio) notFound();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-60px-48px)] -m-4 lg:-m-6 overflow-hidden">
      <PortfolioEditor initialPortfolio={portfolio} />
    </div>
  );
}
