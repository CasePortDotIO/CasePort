"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AlertLevel = "info" | "warning" | "critical";

interface MedicalDocumentationData {
  introText: string;
  calloutText: string;
  alertLevel: AlertLevel;
}

interface MedicalDocumentationEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MedicalDocumentationData) => void;
  initialData?: MedicalDocumentationData;
}

export function MedicalDocumentationEditor({
  open,
  onClose,
  onSave,
  initialData,
}: MedicalDocumentationEditorProps) {
  const [introText, setIntroText] = useState(
    initialData?.introText ||
      "Proper medical documentation is critical to building a strong case. Here's what you need to know about gathering and preserving medical evidence."
  );
  const [calloutText, setCalloutText] = useState(
    initialData?.calloutText ||
      "Never delay treatment. Every day of delay can be used against you by insurance companies."
  );
  const [alertLevel, setAlertLevel] = useState<AlertLevel>(
    initialData?.alertLevel || "info"
  );

  const handleSave = () => {
    onSave({ introText, calloutText, alertLevel });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-w-lg right-0 top-0 h-full" data-vaul-drawer-direction="right">
        <DrawerHeader>
          <DrawerTitle>Edit Medical Documentation</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Intro Text</label>
            <Textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Introduction text..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Callout Text</label>
            <Textarea
              value={calloutText}
              onChange={(e) => setCalloutText(e.target.value)}
              placeholder="Important callout message..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Alert Level</label>
            <Select value={alertLevel} onValueChange={(v) => setAlertLevel(v as AlertLevel)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
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