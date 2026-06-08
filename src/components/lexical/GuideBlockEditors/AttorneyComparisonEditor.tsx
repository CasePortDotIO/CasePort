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
import { Checkbox } from "@/components/ui/checkbox";

interface ComparisonRow {
  id: string;
  factor: string;
  withAttorney: string;
  withoutAttorney: string;
}

interface AttorneyComparisonData {
  title: string;
  subtitle: string;
  rows: ComparisonRow[];
  summaryEnabled: boolean;
}

interface AttorneyComparisonEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AttorneyComparisonData) => void;
  initialData?: AttorneyComparisonData;
}

const defaultRow = (): ComparisonRow => ({
  id: crypto.randomUUID(),
  factor: "",
  withAttorney: "",
  withoutAttorney: "",
});

export function AttorneyComparisonEditor({
  open,
  onClose,
  onSave,
  initialData,
}: AttorneyComparisonEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "Why You Need an Attorney");
  const [subtitle, setSubtitle] = useState(
    initialData?.subtitle || "The difference legal representation can make"
  );
  const [rows, setRows] = useState<ComparisonRow[]>(
    initialData?.rows?.length
      ? initialData.rows
      : [
          defaultRow(),
          defaultRow(),
          defaultRow(),
        ]
  );
  const [summaryEnabled, setSummaryEnabled] = useState(
    initialData?.summaryEnabled ?? true
  );

  const handleAddRow = () => {
    setRows([...rows, defaultRow()]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleRowChange = (id: string, field: keyof ComparisonRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSave = () => {
    onSave({ title, subtitle, rows, summaryEnabled });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-2xl right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit Attorney Comparison</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Why You Need an Attorney"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Subtitle</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="The difference legal representation can make"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Comparison Rows</h3>
              <Button variant="outline" size="sm" onClick={handleAddRow}>
                <Plus className="size-4 mr-1" />
                Add Row
              </Button>
            </div>

            {rows.map((row, index) => (
              <div
                key={row.id}
                className="border rounded-lg p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Row {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={rows.length <= 1}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Factor</label>
                  <Input
                    value={row.factor}
                    onChange={(e) => handleRowChange(row.id, "factor", e.target.value)}
                    placeholder="e.g., Settlement Amount"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">With Attorney</label>
                  <Textarea
                    value={row.withAttorney}
                    onChange={(e) => handleRowChange(row.id, "withAttorney", e.target.value)}
                    placeholder="Result with an attorney..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Without Attorney</label>
                  <Textarea
                    value={row.withoutAttorney}
                    onChange={(e) => handleRowChange(row.id, "withoutAttorney", e.target.value)}
                    placeholder="Result without an attorney..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="summaryEnabled"
              checked={summaryEnabled}
              onCheckedChange={(checked) => setSummaryEnabled(checked === true)}
            />
            <label
              htmlFor="summaryEnabled"
              className="text-sm font-medium cursor-pointer"
            >
              Enable Summary
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