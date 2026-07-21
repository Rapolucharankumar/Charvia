"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GripVertical, Eye, EyeOff, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PortfolioEditorProps {
  initialPortfolio: any;
}

export function PortfolioEditor({ initialPortfolio }: PortfolioEditorProps) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [sections, setSections] = useState(initialPortfolio.sections || []);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialPortfolio.sections?.[0]?.id || null
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item: any, index: number) => ({
      ...item,
      order: index,
    }));

    setSections(updatedItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading("Saving changes...", { id: "save" });
    try {
      // In a real app, you would send this to an API route to update
      const res = await fetch(`/api/portfolio/${portfolio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...portfolio, sections }),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      toast.success("Portfolio saved!", { id: "save" });
    } catch (error) {
      toast.error("Error saving portfolio", { id: "save" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map((s: any) => 
      s.id === id ? { ...s, isHidden: !s.isHidden } : s
    ));
  };

  const activeSection = sections.find((s: any) => s.id === activeSectionId);

  return (
    <div className="flex h-full w-full overflow-hidden">
      
      {/* LEFT PANEL: Controls */}
      <div className="w-[350px] border-r bg-muted/20 flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between bg-background">
          <h2 className="font-semibold text-lg truncate">Editor</h2>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>

        <Tabs defaultValue="sections" className="flex-1 flex flex-col h-full overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b h-12 bg-transparent p-0 px-4 gap-4">
            <TabsTrigger value="sections" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">
              Sections
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">
              Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            {/* SECTIONS TAB */}
            <TabsContent value="sections" className="m-0 p-4 space-y-6">
              <div className="space-y-2">
                <Label>Reorder & Manage Sections</Label>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {sections.map((section: any, index: number) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center gap-2 p-2 border rounded-md bg-background ${activeSectionId === section.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                                onClick={() => setActiveSectionId(section.id)}
                              >
                                <div {...provided.dragHandleProps} className="text-muted-foreground hover:text-foreground">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-sm font-medium capitalize">
                                  {section.type}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id); }}
                                >
                                  {section.isHidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* ACTIVE SECTION CONTENT EDITOR */}
              {activeSection && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold capitalize">{activeSection.type} Content</h3>
                  <div className="text-sm text-muted-foreground">
                    Content editing properties will dynamically appear here based on the section type.
                  </div>
                  {activeSection.type === 'hero' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          value={activeSection.content?.title || ''} 
                          onChange={(e) => {
                            setSections(sections.map((s: any) => 
                              s.id === activeSection.id ? { ...s, content: { ...s.content, title: e.target.value } } : s
                            ));
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* DESIGN TAB */}
            <TabsContent value="design" className="m-0 p-4 space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select 
                  value={portfolio.theme} 
                  onValueChange={(val) => setPortfolio({ ...portfolio, theme: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    type="color" 
                    value={portfolio.colorHex} 
                    onChange={(e) => setPortfolio({ ...portfolio, colorHex: e.target.value })}
                    className="w-12 h-12 p-1"
                  />
                  <Input 
                    type="text" 
                    value={portfolio.colorHex} 
                    onChange={(e) => setPortfolio({ ...portfolio, colorHex: e.target.value })}
                    className="flex-1 uppercase font-mono"
                  />
                </div>
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="m-0 p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publish Portfolio</Label>
                  <div className="text-sm text-muted-foreground">Make your portfolio public</div>
                </div>
                <Switch 
                  checked={portfolio.isPublished}
                  onCheckedChange={(checked) => setPortfolio({ ...portfolio, isPublished: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <div className="flex gap-2">
                  <Input value={portfolio.username} disabled />
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`https://${portfolio.username}.charvia.app`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input 
                  value={portfolio.seoTitle || ''} 
                  onChange={(e) => setPortfolio({ ...portfolio, seoTitle: e.target.value })}
                  placeholder="John Doe - Software Engineer"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="flex-1 bg-muted p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-5xl bg-background rounded-lg shadow-xl overflow-y-auto border flex flex-col relative transition-all duration-300">
          
          {/* Mock Browser Header */}
          <div className="h-10 border-b flex items-center px-4 gap-2 bg-muted/50 sticky top-0 z-10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto bg-background border text-xs px-24 py-1 rounded-md text-muted-foreground">
              {portfolio.username}.charvia.app
            </div>
          </div>

          {/* Actual Live Preview Content would render here */}
          <div className="flex-1 p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
            <p>Live Preview Component</p>
            <p className="text-sm">Theme: {portfolio.theme}, Color: {portfolio.colorHex}</p>
            <div className="mt-8 text-left w-full max-w-md border rounded-md p-4 bg-muted/10">
              <h4 className="font-medium mb-2">Visible Sections order:</h4>
              <ul className="list-decimal pl-4 space-y-1 text-sm">
                {sections.filter((s: any) => !s.isHidden).map((s: any) => (
                  <li key={s.id}>{s.type} {s.type === 'hero' && s.content?.title ? `- ${s.content.title}` : ''}</li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
