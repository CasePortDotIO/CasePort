import { useState, useCallback, useEffect, useRef } from 'react';
import { SCREENS, PHASE_MAP, type ScreenConfig } from '@/lib/formData';
import { trpc } from '@/lib/trpc';

export interface ContactInfo {
  website: string;
  firmName: string;
  fullName: string;
  title: string;
  workEmail: string;
  phone: string;
  linkedin: string;
}

export interface FormState {
  currentScreen: number;
  answers: Record<number, string | string[]>;
  contactInfo: ContactInfo;
  status: 'active' | 'hard-stop' | 'soft-fail' | 'submitted' | 'submitting';
  softFailMessage: string | null;
  hardStopMessage: string | null;
  hardStopSupport: string | null;
  direction: 'forward' | 'backward';
  submitError: string | null;
}

const STORAGE_KEY = 'caseport_access_flow_v1';

const initialContactInfo: ContactInfo = {
  website: '',
  firmName: '',
  fullName: '',
  title: '',
  workEmail: '',
  phone: '',
  linkedin: '',
};

const initialState: FormState = {
  currentScreen: 1,
  answers: {},
  contactInfo: initialContactInfo,
  status: 'active',
  softFailMessage: null,
  hardStopMessage: null,
  hardStopSupport: null,
  direction: 'forward',
  submitError: null,
};

// ─── UTM capture ─────────────────────────────────────────────────────────────
function getUtmParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
    referrer: document.referrer || undefined,
  };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadSavedState(): Partial<FormState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Only restore if it's a meaningful partial progress (screen > 1 or has answers)
    if (parsed.currentScreen > 1 || Object.keys(parsed.answers ?? {}).length > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveState(state: FormState) {
  try {
    // Don't save if submitted or hard-stopped
    if (state.status === 'submitted' || state.status === 'hard-stop') {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const toSave = {
      currentScreen: state.currentScreen,
      answers: state.answers,
      contactInfo: state.contactInfo,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Ignore storage errors
  }
}

function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function useFormState() {
  const utmRef = useRef(getUtmParams());

  const [state, setState] = useState<FormState>(() => {
    const saved = loadSavedState();
    if (saved) {
      return {
        ...initialState,
        currentScreen: saved.currentScreen ?? 1,
        answers: saved.answers ?? {},
        contactInfo: { ...initialContactInfo, ...(saved.contactInfo ?? {}) },
      };
    }
    return initialState;
  });

  const [restoredFromSave, setRestoredFromSave] = useState(() => {
    const saved = loadSavedState();
    return saved !== null;
  });

  // Persist state to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const submitMutation = trpc.application.submit.useMutation();

  const currentScreenConfig = SCREENS.find(s => s.id === state.currentScreen) as ScreenConfig;
  const currentPhaseIndex = PHASE_MAP[state.currentScreen] ?? 0;
  const totalScreens = SCREENS.length;
  const progressPercent = ((state.currentScreen - 1) / totalScreens) * 100;

  const dismissRestoreNotice = useCallback(() => {
    setRestoredFromSave(false);
  }, []);

  const resetProgress = useCallback(() => {
    clearSavedState();
    setState(initialState);
    setRestoredFromSave(false);
  }, []);

  const selectOption = useCallback((screenId: number, optionId: string) => {
    const screen = SCREENS.find(s => s.id === screenId);
    if (!screen?.options) return;

    const option = screen.options.find(o => o.id === optionId);
    if (!option) return;

    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [screenId]: optionId },
    }));

    setTimeout(() => {
      if (option.outcome === 'hard-stop') {
        setState(prev => ({
          ...prev,
          status: 'hard-stop',
          hardStopMessage: screen.hardStopMessage || 'Thank you for your interest.',
          hardStopSupport: screen.hardStopSupport || null,
        }));
      } else if (option.outcome === 'soft-fail' && screen.softFailMessage) {
        setState(prev => ({
          ...prev,
          status: 'soft-fail',
          softFailMessage: screen.softFailMessage || null,
        }));
      } else if (screen.autoAdvance) {
        goNext();
      }
    }, 400);
  }, []);

  const setMultiSelect = useCallback((screenId: number, values: string[]) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [screenId]: values },
    }));
  }, []);

  const updateContactInfo = useCallback((field: keyof ContactInfo, value: string) => {
    setState(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  }, []);

  const goNext = useCallback(() => {
    setState(prev => {
      const nextScreen = prev.currentScreen + 1;
      if (nextScreen > SCREENS.length) {
        return { ...prev, status: 'submitted' };
      }
      return {
        ...prev,
        currentScreen: nextScreen,
        status: 'active',
        softFailMessage: null,
        direction: 'forward',
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.currentScreen <= 1) return prev;
      return {
        ...prev,
        currentScreen: prev.currentScreen - 1,
        status: 'active',
        softFailMessage: null,
        hardStopMessage: null,
        hardStopSupport: null,
        direction: 'backward',
      };
    });
  }, []);

  const dismissSoftFail = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'active',
      softFailMessage: null,
    }));
    setTimeout(() => {
      goNext();
    }, 100);
  }, [goNext]);

  const submitApplication = useCallback(async () => {
    const { contactInfo, answers } = state;

    setState(prev => ({ ...prev, status: 'submitting', submitError: null }));

    try {
      // Convert numeric keys to string keys for the API
      const stringAnswers: Record<string, string | string[]> = {};
      Object.entries(answers).forEach(([k, v]) => {
        stringAnswers[k] = v;
      });

      await submitMutation.mutateAsync({
        firmName: contactInfo.firmName,
        fullName: contactInfo.fullName,
        title: contactInfo.title,
        workEmail: contactInfo.workEmail,
        phone: contactInfo.phone,
        website: contactInfo.website,
        linkedIn: contactInfo.linkedin || undefined,
        answers: stringAnswers,
        ...utmRef.current,
      });

      clearSavedState();
      setState(prev => ({ ...prev, status: 'submitted', submitError: null }));
    } catch (err) {
      console.error('[submitApplication] Error:', err);
      setState(prev => ({
        ...prev,
        status: 'active',
        submitError: 'Submission failed. Please check your connection and try again.',
      }));
    }
  }, [state, submitMutation]);

  return {
    state,
    currentScreenConfig,
    currentPhaseIndex,
    totalScreens,
    progressPercent,
    restoredFromSave,
    dismissRestoreNotice,
    resetProgress,
    selectOption,
    setMultiSelect,
    updateContactInfo,
    goNext,
    goBack,
    dismissSoftFail,
    submitApplication,
  };
}
