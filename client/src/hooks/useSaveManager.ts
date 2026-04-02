import { useCallback, useRef, useState, useEffect } from "react";

export interface SaveState {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  error: string | null;
  retryCount: number;
}

interface UseSaveManagerOptions {
  onSave: () => Promise<void>;
  debounceDelay?: number;
  maxRetries?: number;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export function useSaveManager({
  onSave,
  debounceDelay = 1200,
  maxRetries = 3,
  onError,
  onSuccess,
}: UseSaveManagerOptions) {
  const [state, setState] = useState<SaveState>({
    isSaving: false,
    hasUnsavedChanges: false,
    lastSavedAt: null,
    error: null,
    retryCount: 0,
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  // Mark as unsaved
  const markUnsaved = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasUnsavedChanges: true,
      error: null,
    }));
  }, []);

  // Perform save with retry logic
  const performSave = useCallback(async () => {
    // Prevent concurrent saves
    if (state.isSaving) return;

    setState((prev) => ({
      ...prev,
      isSaving: true,
      error: null,
    }));

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Create new abort controller for this attempt
        abortControllerRef.current = new AbortController();

        await onSave();

        // Success
        setState((prev) => ({
          ...prev,
          isSaving: false,
          hasUnsavedChanges: false,
          lastSavedAt: new Date(),
          error: null,
          retryCount: 0,
        }));

        retryCountRef.current = 0;
        onSuccess?.();
        return;
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.message?.includes("HTTP 4")) {
          break;
        }

        // If not last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    const errorMessage =
      lastError?.message || "Failed to save page. Please try again.";

    setState((prev) => ({
      ...prev,
      isSaving: false,
      error: errorMessage,
      retryCount: maxRetries,
    }));

    onError?.(errorMessage);
  }, [state.isSaving, onSave, maxRetries, onError, onSuccess]);

  // Debounced auto-save
  const triggerAutoSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceDelay);
  }, [debounceDelay, performSave]);

  // Manual save (immediate)
  const save = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    await performSave();
  }, [performSave]);

  // Cancel pending save
  const cancelSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    abortControllerRef.current?.abort();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSave();
    };
  }, [cancelSave]);

  return {
    ...state,
    markUnsaved,
    save,
    triggerAutoSave,
    cancelSave,
  };
}
