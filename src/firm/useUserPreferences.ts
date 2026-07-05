import { useState, useEffect, useCallback } from "react";

export interface UserPreferences {
  theme: "dark" | "light";
  dashboardLayout: "default" | "compact" | "expanded";
  defaultMarket: string;
  defaultCaseType: string;
  autoRefreshInterval: number; // in seconds
  showNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  savedFilters: Array<{
    id: string;
    name: string;
    filters: Record<string, string | string[]>;
  }>;
  pinnedMetrics: string[];
  defaultSort: "date" | "value" | "status";
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  dashboardLayout: "default",
  defaultMarket: "Houston",
  defaultCaseType: "Auto Accident",
  autoRefreshInterval: 30,
  showNotifications: true,
  emailAlerts: true,
  smsAlerts: false,
  savedFilters: [],
  pinnedMetrics: ["balance", "delivered", "signed", "score"],
  defaultSort: "date",
};

const STORAGE_KEY = "caseport_user_preferences";

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    DEFAULT_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.error("Failed to save preferences:", error);
      }
    },
    [preferences]
  );

  // Add saved filter
  const addSavedFilter = useCallback(
    (name: string, filters: Record<string, string | string[]>) => {
      const newFilter = {
        id: Date.now().toString(),
        name,
        filters,
      };
      updatePreferences({
        savedFilters: [...preferences.savedFilters, newFilter],
      });
      return newFilter.id;
    },
    [preferences.savedFilters, updatePreferences]
  );

  // Remove saved filter
  const removeSavedFilter = useCallback(
    (filterId: string) => {
      updatePreferences({
        savedFilters: preferences.savedFilters.filter((f) => f.id !== filterId),
      });
    },
    [preferences.savedFilters, updatePreferences]
  );

  // Update saved filter
  const updateSavedFilter = useCallback(
    (filterId: string, updates: Partial<(typeof preferences.savedFilters)[0]>) => {
      updatePreferences({
        savedFilters: preferences.savedFilters.map((f) =>
          f.id === filterId ? { ...f, ...updates } : f
        ),
      });
    },
    [preferences.savedFilters, updatePreferences]
  );

  // Toggle pinned metric
  const togglePinnedMetric = useCallback(
    (metricId: string) => {
      const newPinned = preferences.pinnedMetrics.includes(metricId)
        ? preferences.pinnedMetrics.filter((m) => m !== metricId)
        : [...preferences.pinnedMetrics, metricId];
      updatePreferences({ pinnedMetrics: newPinned });
    },
    [preferences.pinnedMetrics, updatePreferences]
  );

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to reset preferences:", error);
    }
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    addSavedFilter,
    removeSavedFilter,
    updateSavedFilter,
    togglePinnedMetric,
    resetToDefaults,
  };
}
