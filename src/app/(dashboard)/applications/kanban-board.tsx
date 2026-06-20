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

const STAGES: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: "APPLIED", title: "Applied", color: "bg-blue-500/10 border-blue-500/20" },
  { id: "ASSESSMENT", title: "Assessment", color: "bg-orange-500/10 border-orange-500/20" },
  { id: "INTERVIEW", title: "Interview", color: "bg-purple-500/10 border-purple-500/20" },
  { id: "HR_ROUND", title: "HR Round", color: "bg-pink-500/10 border-pink-500/20" },
  { id: "OFFER", title: "Offer", color: "bg-green-500/10 border-green-500/20" },
  { id: "REJECTED", title: "Rejected", color: "bg-red-500/10 border-red-500/20" },
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
            <div key={stage.id} className="min-w-[300px] w-[300px] flex-shrink-0 bg-muted/30 rounded-lg p-3 border">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold">{stage.title}</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
                  {getApplicationsByStatus(stage.id).length}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[150px] transition-colors rounded-md ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {getApplicationsByStatus(stage.id).map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "z-50" : ""}`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <Card className={`border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${stage.color}`}>
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
