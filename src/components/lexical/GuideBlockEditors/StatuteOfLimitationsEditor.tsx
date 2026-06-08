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

interface StateInfo {
  id: string;
  state: string;
  years: number;
  notes: string;
}

interface Exception {
  id: string;
  text: string;
}

interface StatuteOfLimitationsData {
  title: string;
  description: string;
  defaultYears: number;
  states: StateInfo[];
  exceptions: Exception[];
}

interface StatuteOfLimitationsEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StatuteOfLimitationsData) => void;
  initialData?: StatuteOfLimitationsData;
}

const defaultStateInfo = (): StateInfo => ({
  id: crypto.randomUUID(),
  state: "",
  years: 2,
  notes: "",
});

const defaultException = (): Exception => ({
  id: crypto.randomUUID(),
  text: "",
});

export function StatuteOfLimitationsEditor({
  open,
  onClose,
  onSave,
  initialData,
}: StatuteOfLimitationsEditorProps) {
  const [title, setTitle] = useState(
    initialData?.title || "Statute of Limitations"
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      "The statute of limitations sets the deadline for filing a personal injury lawsuit. These time limits vary by state and can be affected by factors such as when the injury was discovered."
  );
  const [defaultYears, setDefaultYears] = useState(
    initialData?.defaultYears || 2
  );
  const [states, setStates] = useState<StateInfo[]>(
    initialData?.states?.length ? initialData.states : [defaultStateInfo()]
  );
  const [exceptions, setExceptions] = useState<Exception[]>(
    initialData?.exceptions?.length ? initialData.exceptions : [defaultException()]
  );

  const handleAddState = () => {
    setStates([...states, defaultStateInfo()]);
  };

  const handleRemoveState = (id: string) => {
    if (states.length <= 1) return;
    setStates(states.filter((s) => s.id !== id));
  };

  const handleStateChange = (id: string, field: keyof StateInfo, value: string | number) => {
    setStates(states.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAddException = () => {
    setExceptions([...exceptions, defaultException()]);
  };

  const handleRemoveException = (id: string) => {
    if (exceptions.length <= 1) return;
    setExceptions(exceptions.filter((e) => e.id !== id));
  };

  const handleExceptionChange = (id: string, value: string) => {
    setExceptions(exceptions.map((e) => (e.id === id ? { ...e, text: value } : e)));
  };

  const handleSave = () => {
    onSave({ title, description, defaultYears, states, exceptions });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-2xl right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit Statute of Limitations</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Statute of Limitations"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="General description..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Default Years</label>
              <Input
                type="number"
                value={defaultYears}
                onChange={(e) => setDefaultYears(parseInt(e.target.value) || 0)}
                placeholder="2"
                min={0}
                className="w-32"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">State Exceptions</h3>
              <Button variant="outline" size="sm" onClick={handleAddState}>
                <Plus className="size-4 mr-1" />
                Add State
              </Button>
            </div>

            {states.map((state, index) => (
              <div
                key={state.id}
                className="border rounded-lg p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">State {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveState(state.id)}
                    disabled={states.length <= 1}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">State</label>
                    <Input
                      value={state.state}
                      onChange={(e) => handleStateChange(state.id, "state", e.target.value)}
                      placeholder="e.g., California"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Years</label>
                    <Input
                      type="number"
                      value={state.years}
                      onChange={(e) => handleStateChange(state.id, "years", parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Notes</label>
                    <Input
                      value={state.notes}
                      onChange={(e) => handleStateChange(state.id, "notes", e.target.value)}
                      placeholder="Special notes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">General Exceptions</h3>
              <Button variant="outline" size="sm" onClick={handleAddException}>
                <Plus className="size-4 mr-1" />
                Add Exception
              </Button>
            </div>

            {exceptions.map((exception, index) => (
              <div key={exception.id} className="flex items-center gap-2">
                <Textarea
                  value={exception.text}
                  onChange={(e) => handleExceptionChange(exception.id, e.target.value)}
                  placeholder="Exception description..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveException(exception.id)}
                  disabled={exceptions.length <= 1}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
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