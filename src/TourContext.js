import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TourOverlay from './TourOverlay';

export const TourContext = createContext({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
});

export const TourProvider = ({ children, onNavigate }) => {
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const registerStep = useCallback((step) => {
    setSteps((prev) => {
      const others = prev.filter((s) => s.id !== step.id);
      return [...others, step];
    });
  }, []);

  const sortedSteps = useMemo(() => steps.slice().sort((a, b) => a.order - b.order), [steps]);

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
  const currentRef = currentStep?.ref;

  return (
    <TourContext.Provider value={{ registerStep, start, next, stop, currentStep }}>
      {children}
      <TourOverlay step={currentStep} targetRef={currentRef} />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
