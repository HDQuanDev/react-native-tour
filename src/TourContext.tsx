import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { MutableRefObject } from 'react';
import TourOverlay from './TourOverlay';
import type { TourStepConfig } from './types';

interface TourContextValue {
  registerStep: (id: string, ref: MutableRefObject<any>) => void;
  start: () => void;
  next: () => void;
  stop: () => void;
  currentStep?: TourStepConfig;
}

export const TourContext = createContext<TourContextValue>({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
});

interface TourProviderProps {
  children: React.ReactNode;
  steps: TourStepConfig[];
  /**
   * Called when a step points to a different screen. Implement with your navigation lib.
   */
  onNavigate?: (screen: string) => void;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children, steps, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [refs, setRefs] = useState<Record<string, MutableRefObject<any>>>({});

  const registerStep = useCallback((id: string, ref: MutableRefObject<any>) => {
    setRefs((prev) => ({ ...prev, [id]: ref }));
  }, []);

  const sortedSteps = useMemo(() => [...steps].sort((a, b) => a.order - b.order), [steps]);

  const start = useCallback(() => {
    if (sortedSteps.length === 0) return;
    const first = sortedSteps[0];
    if (first.screen && onNavigate) onNavigate(first.screen);
    setCurrentIndex(0);
  }, [sortedSteps, onNavigate]);

  const next = useCallback(() => {
    if (currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < sortedSteps.length) {
      const step = sortedSteps[nextIndex];
      if (step.screen && onNavigate) onNavigate(step.screen);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(null);
    }
  }, [currentIndex, sortedSteps, onNavigate]);

  const stop = useCallback(() => setCurrentIndex(null), []);

  const currentStep = currentIndex === null ? undefined : sortedSteps[currentIndex];
  const currentRef = currentStep ? refs[currentStep.id] : undefined;

  return (
    <TourContext.Provider value={{ registerStep, start, next, stop, currentStep }}>
      {children}
      <TourOverlay step={currentStep} targetRef={currentRef} onNext={next} />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
