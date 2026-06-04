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
import { Checkbox } from "@/components/ui/checkbox";

interface StateRange {
  id: string;
  stateCode: string;
  minAmount: string;
  maxAmount: string;
  avgAmount: string;
}

interface SettlementRangesData {
  title: string;
  stateRangesJson: string;
  showCatastrophic: boolean;
}

interface SettlementRangesEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SettlementRangesData) => void;
  initialData?: SettlementRangesData;
}

const defaultStateRange = (): StateRange => ({
  id: crypto.randomUUID(),
  stateCode: "",
  minAmount: "",
  maxAmount: "",
  avgAmount: "",
});

function generateStateRangesJson(ranges: StateRange[]): string {
  const json = ranges.reduce(
    (acc, range) => {
      if (range.stateCode) {
        acc[range.stateCode.toUpperCase()] = {
          min: range.minAmount,
          max: range.maxAmount,
          avg: range.avgAmount,
        };
      }
      return acc;
    },
    {} as Record<string, { min: string; max: string; avg: string }>
  );
  return JSON.stringify(json, null, 2);
}

export function SettlementRangesEditor({
  open,
  onClose,
  onSave,
  initialData,
}: SettlementRangesEditorProps) {
  const [title, setTitle] = useState(
    initialData?.title || "Settlement Ranges by State"
  );
  const [stateRanges, setStateRanges] = useState<StateRange[]>(() => {
    if (initialData?.stateRangesJson) {
      try {
        const parsed = JSON.parse(initialData.stateRangesJson);
        return Object.entries(parsed).map(([stateCode, values]) => ({
          id: crypto.randomUUID(),
          stateCode,
          minAmount: (values as any).min || "",
          maxAmount: (values as any).max || "",
          avgAmount: (values as any).avg || "",
        }));
      } catch {
        return [defaultStateRange()];
      }
    }
    return [defaultStateRange()];
  });
  const [showCatastrophic, setShowCatastrophic] = useState(
    initialData?.showCatastrophic ?? true
  );

  const handleAddState = () => {
    setStateRanges([...stateRanges, defaultStateRange()]);
  };

  const handleRemoveState = (id: string) => {
    if (stateRanges.length <= 1) return;
    setStateRanges(stateRanges.filter((s) => s.id !== id));
  };

  const handleStateChange = (id: string, field: keyof StateRange, value: string) => {
    setStateRanges(stateRanges.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSave = () => {
    const stateRangesJson = generateStateRangesJson(stateRanges);
    onSave({ title, stateRangesJson, showCatastrophic });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-2xl right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit Settlement Ranges</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Settlement Ranges by State"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">State Ranges</h3>
              <Button variant="outline" size="sm" onClick={handleAddState}>
                <Plus className="size-4 mr-1" />
                Add State
              </Button>
            </div>

            {stateRanges.map((stateRange, index) => (
              <div
                key={stateRange.id}
                className="border rounded-lg p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">State {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveState(stateRange.id)}
                    disabled={stateRanges.length <= 1}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">State Code</label>
                    <Input
                      value={stateRange.stateCode}
                      onChange={(e) => handleStateChange(stateRange.id, "stateCode", e.target.value)}
                      placeholder="e.g., CA"
                      maxLength={2}
                      className="uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Min Amount</label>
                    <Input
                      value={stateRange.minAmount}
                      onChange={(e) => handleStateChange(stateRange.id, "minAmount", e.target.value)}
                      placeholder="e.g., $50,000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Max Amount</label>
                    <Input
                      value={stateRange.maxAmount}
                      onChange={(e) => handleStateChange(stateRange.id, "maxAmount", e.target.value)}
                      placeholder="e.g., $150,000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Avg Amount</label>
                    <Input
                      value={stateRange.avgAmount}
                      onChange={(e) => handleStateChange(stateRange.id, "avgAmount", e.target.value)}
                      placeholder="e.g., $85,000"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showCatastrophic"
              checked={showCatastrophic}
              onCheckedChange={(checked) => setShowCatastrophic(checked === true)}
            />
            <label
              htmlFor="showCatastrophic"
              className="text-sm font-medium cursor-pointer"
            >
              Show Catastrophic Injuries
            </label>
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