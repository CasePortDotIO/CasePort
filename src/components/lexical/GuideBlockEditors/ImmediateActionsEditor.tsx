"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timeNote: string;
  bullets: string[];
}

interface ImmediateActionsData {
  title: string;
  subtitle: string;
  steps: Step[];
}

interface ImmediateActionsEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ImmediateActionsData) => void;
  initialData?: ImmediateActionsData;
}

const defaultStep = (number: number): Step => ({
  id: crypto.randomUUID(),
  stepNumber: number,
  title: "",
  description: "",
  timeNote: "",
  bullets: [""],
});

export function ImmediateActionsEditor({
  open,
  onClose,
  onSave,
  initialData,
}: ImmediateActionsEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "The 72-Hour Action Plan");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [steps, setSteps] = useState<Step[]>(
    initialData?.steps?.length
      ? initialData.steps
      : [defaultStep(1), defaultStep(2), defaultStep(3)]
  );

  const handleAddStep = () => {
    setSteps([
      ...steps,
      defaultStep(steps.length + 1),
    ]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== id).map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const handleStepChange = (id: string, field: keyof Step, value: string | string[]) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleBulletChange = (stepId: string, bulletIndex: number, value: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    const newBullets = [...step.bullets];
    newBullets[bulletIndex] = value;
    handleStepChange(stepId, "bullets", newBullets);
  };

  const handleAddBullet = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    handleStepChange(stepId, "bullets", [...step.bullets, ""]);
  };

  const handleRemoveBullet = (stepId: string, bulletIndex: number) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step || step.bullets.length <= 1) return;
    handleStepChange(
      stepId,
      "bullets",
      step.bullets.filter((_, i) => i !== bulletIndex)
    );
  };

  const handleSave = () => {
    onSave({ title, subtitle, steps });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-2xl right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit 72-Hour Action Plan</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The 72-Hour Action Plan"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Subtitle</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="What you need to do in the first 72 hours"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Steps</h3>
              <Button variant="outline" size="sm" onClick={handleAddStep}>
                <Plus className="size-4 mr-1" />
                Add Step
              </Button>
            </div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="border rounded-lg p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step {step.stepNumber}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveStep(step.id)}
                    disabled={steps.length <= 1}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Title</label>
                  <Input
                    value={step.title}
                    onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                    placeholder="Step title"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Description</label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                    placeholder="Describe this step..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Time Note</label>
                  <Input
                    value={step.timeNote}
                    onChange={(e) => handleStepChange(step.id, "timeNote", e.target.value)}
                    placeholder="e.g., Within 24 hours"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Bullet Points</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddBullet(step.id)}
                    >
                      <Plus className="size-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  {step.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => handleBulletChange(step.id, i, e.target.value)}
                        placeholder="Bullet point"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveBullet(step.id, i)}
                        disabled={step.bullets.length <= 1}
                      >
                        <Trash2 className="size-3 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}