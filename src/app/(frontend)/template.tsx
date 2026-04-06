"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Forcing a fresh remount on route changes absolutely pulverizes 
  // the Next.js React 19/ bfcache issue with framer-motion's observers.
  return <div key={pathname}>{children}</div>;
}