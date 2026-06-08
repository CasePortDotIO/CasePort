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

interface SettlementExample {
  id: string;
  settlement: string;
  settlementValue: string;
  injuryType: string;
  caseType: string;
  caseResolutionTime: string;
  quote: string;
  name: string;
  location: string;
}

interface SettlementExampleData {
  title: string;
  examples: SettlementExample[];
}

interface SettlementExampleEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SettlementExampleData) => void;
  initialData?: SettlementExampleData;
}

const defaultExample = (): SettlementExample => ({
  id: crypto.randomUUID(),
  settlement: "",
  settlementValue: "",
  injuryType: "",
  caseType: "",
  caseResolutionTime: "",
  quote: "",
  name: "",
  location: "",
});

export function SettlementExampleEditor({
  open,
  onClose,
  onSave,
  initialData,
}: SettlementExampleEditorProps) {
  const [title, setTitle] = useState(
    initialData?.title || "Real Case Results"
  );
  const [examples, setExamples] = useState<SettlementExample[]>(
    initialData?.examples?.length ? initialData.examples : [defaultExample()]
  );

  const handleAddExample = () => {
    setExamples([...examples, defaultExample()]);
  };

  const handleRemoveExample = (id: string) => {
    if (examples.length <= 1) return;
    setExamples(examples.filter((e) => e.id !== id));
  };

  const handleExampleChange = (id: string, field: keyof SettlementExample, value: string) => {
    setExamples(examples.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleSave = () => {
    onSave({ title, examples });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-2xl right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit Settlement Examples</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Real Case Results"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Examples</h3>
              <Button variant="outline" size="sm" onClick={handleAddExample}>
                <Plus className="size-4 mr-1" />
                Add Example
              </Button>
            </div>

            {examples.map((example, index) => (
              <div
                key={example.id}
                className="border rounded-lg p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Example {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveExample(example.id)}
                    disabled={examples.length <= 1}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Settlement Title</label>
                    <Input
                      value={example.settlement}
                      onChange={(e) => handleExampleChange(example.id, "settlement", e.target.value)}
                      placeholder="e.g., Rear-End Collision"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Settlement Value</label>
                    <Input
                      value={example.settlementValue}
                      onChange={(e) => handleExampleChange(example.id, "settlementValue", e.target.value)}
                      placeholder="e.g., $250,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Injury Type</label>
                    <Input
                      value={example.injuryType}
                      onChange={(e) => handleExampleChange(example.id, "injuryType", e.target.value)}
                      placeholder="e.g., Whiplash"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Case Type</label>
                    <Input
                      value={example.caseType}
                      onChange={(e) => handleExampleChange(example.id, "caseType", e.target.value)}
                      placeholder="e.g., Auto Accident"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Resolution Time</label>
                  <Input
                    value={example.caseResolutionTime}
                    onChange={(e) => handleExampleChange(example.id, "caseResolutionTime", e.target.value)}
                    placeholder="e.g., 6 months"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Quote</label>
                  <Textarea
                    value={example.quote}
                    onChange={(e) => handleExampleChange(example.id, "quote", e.target.value)}
                    placeholder="Client quote..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Name</label>
                    <Input
                      value={example.name}
                      onChange={(e) => handleExampleChange(example.id, "name", e.target.value)}
                      placeholder="Client first name or initials"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Location</label>
                    <Input
                      value={example.location}
                      onChange={(e) => handleExampleChange(example.id, "location", e.target.value)}
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>
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