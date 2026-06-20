"use client";

import { useState } from "react";
import { Application, ApplicationStatus } from "@prisma/client";
import { KanbanBoard } from "./kanban-board";
import { ApplicationModal } from "./application-modal";

export function KanbanBoardWrapper({ initialData }: { initialData: Application[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStage, setDefaultStage] = useState<ApplicationStatus>("APPLIED");

  const handleAddClick = (stage: ApplicationStatus) => {
    setDefaultStage(stage);
    setIsModalOpen(true);
  };

  return (
    <>
      <KanbanBoard initialData={initialData} onAdd={handleAddClick} />
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialStatus={defaultStage}
        onSuccess={() => setIsModalOpen(false)} 
      />
    </>
  );
}
