import React, { createContext, useCallback, useContext, useState } from 'react';
import TourOverlay from './TourOverlay';
import type { RegisteredStep } from './types';

interface TourContextValue {
  registerStep: (step: RegisteredStep) => void;
  start: () => void;
  next: () => void;
  stop: () => void;
  currentStep?: RegisteredStep;
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
  /**
   * Called when a step points to a different screen. Implement with your navigation lib.
   */
  onNavigate?: (screen: string) => void;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children, onNavigate }) => {
  const [steps, setSteps] = useState<RegisteredStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const registerStep = useCallback((step: RegisteredStep) => {
    setSteps((prev) => {
      const filtered = prev.filter((s) => s.id !== step.id);
      return [...filtered, step];
    });
  }, []);

  const start = useCallback(() => {
    if (steps.length === 0) return;
    const sorted = [...steps].sort((a, b) => a.order - b.order);
    setSteps(sorted);
    const first = sorted[0];
    if (first.screen && onNavigate) onNavigate(first.screen);
    setCurrentIndex(0);
  }, [steps, onNavigate]);

  const next = useCallback(() => {
    if (currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      const step = steps[nextIndex];
      if (step.screen && onNavigate) onNavigate(step.screen);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(null);
    }
  }, [currentIndex, steps, onNavigate]);

  const stop = useCallback(() => setCurrentIndex(null), []);

  const currentStep = currentIndex === null ? undefined : steps[currentIndex];

  return (
    <TourContext.Provider value={{ registerStep, start, next, stop, currentStep }}>
      {children}
      <TourOverlay step={currentStep} onNext={next} />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
