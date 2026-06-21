"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ApplicationStatus, Application } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar } from "lucide-react";
import { updateApplicationStatus, deleteApplication } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";

interface KanbanBoardProps {
  initialData: Application[];
  onAdd: (status: ApplicationStatus) => void;
}

const STAGES: { id: ApplicationStatus; title: string; color: string; border: string }[] = [
  { id: "APPLIED", title: "Applied", color: "text-blue-500", border: "border-l-blue-500" },
  { id: "ASSESSMENT", title: "Assessment", color: "text-orange-500", border: "border-l-orange-500" },
  { id: "INTERVIEW", title: "Interview", color: "text-purple-500", border: "border-l-purple-500" },
  { id: "HR_ROUND", title: "HR Round", color: "text-pink-500", border: "border-l-pink-500" },
  { id: "OFFER", title: "Offer", color: "text-green-500", border: "border-l-green-500" },
  { id: "REJECTED", title: "Rejected", color: "text-red-500", border: "border-l-red-500" },
];

export function KanbanBoard({ initialData, onAdd }: KanbanBoardProps) {
  const [data, setData] = useState<Application[]>(initialData);
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredData = data.filter(
    app => 
      app.companyName.toLowerCase().includes(search.toLowerCase()) || 
      app.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return filteredData.filter(app => app.status === status);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;
    
    // Optimistic UI update
    setData(prev => 
      prev.map(app => 
        app.id === draggableId ? { ...app, status: newStatus } : app
      )
    );

    try {
      await updateApplicationStatus(draggableId, newStatus);
    } catch (error) {
      // Revert on failure
      setData(initialData);
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    setData(prev => prev.filter(app => app.id !== id));
    try {
      await deleteApplication(id);
    } catch (error) {
      setData(initialData);
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input 
          placeholder="Search company or job title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => onAdd("APPLIED")}>
          <Plus className="mr-2 h-4 w-4" /> Add Application
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)] items-start">
        <DragDropContext onDragEnd={onDragEnd}>
          {STAGES.map((stage) => (
            <div key={stage.id} className="min-w-[320px] w-[320px] flex-shrink-0 bg-muted/30 rounded-2xl p-4 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={`font-sora font-bold text-sm uppercase tracking-wider ${stage.color}`}>{stage.title}</h3>
                <span className="text-xs bg-card text-muted-foreground px-2.5 py-1 rounded-full font-bold shadow-sm border border-border">
                  {getApplicationsByStatus(stage.id).length}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[150px] transition-all duration-300 rounded-xl p-1 ${
                      snapshot.isDraggingOver ? "bg-primary/5 ring-2 ring-primary/20 shadow-inner" : ""
                    }`}
                  >
                    {getApplicationsByStatus(stage.id).map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "z-50" : "hover:-translate-y-1 transition-transform duration-300"}`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <Card className={`border-none shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing bg-card rounded-xl border-l-4 ${stage.border} ${snapshot.isDragging ? "ring-2 ring-primary/40 shadow-2xl scale-105 rotate-2" : "hover:shadow-md"}`}>
                              <CardContent className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium leading-none line-clamp-1">{app.jobTitle}</div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(app.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">{app.companyName}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-2">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full text-muted-foreground justify-start text-xs border-dashed"
                      onClick={() => onAdd(stage.id)}
                    >
                      <Plus className="h-3 w-3 mr-2" /> Add
                    </Button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
