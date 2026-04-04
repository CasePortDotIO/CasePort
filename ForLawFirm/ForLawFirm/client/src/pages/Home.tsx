import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Home page redirects to the primary landing page /for-law-firms.
 * This will be replaced with a full homepage when additional pages are built.
 */
export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/for-law-firms");
  }, [setLocation]);

  return null;
}
