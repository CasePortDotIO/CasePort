import { useState, useCallback } from 'react';

interface HistoryEntry<T> {
  state: T;
  timestamp: number;
}

interface UndoRedoState<T> {
  past: HistoryEntry<T>[];
  present: HistoryEntry<T>;
  future: HistoryEntry<T>[];
}

export function useUndoRedo<T>(initialState: T, maxHistory = 10) {
  const [history, setHistory] = useState<UndoRedoState<T>>({
    past: [],
    present: { state: initialState, timestamp: Date.now() },
    future: [],
  });

  const setState = useCallback((newState: T) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present].slice(-maxHistory),
      present: { state: newState, timestamp: Date.now() },
      future: [],
    }));
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: { state: newState, timestamp: Date.now() },
      future: [],
    });
  }, []);

  return {
    state: history.present.state,
    setState,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    history: {
      past: history.past.map((h) => h.state),
      future: history.future.map((h) => h.state),
    },
  };
}
