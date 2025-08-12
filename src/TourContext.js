import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TourOverlay from './TourOverlay';

export const TourContext = createContext({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
});

export const TourProvider = ({ children, steps: stepDefs = [], onNavigate }) => {
  const [registry, setRegistry] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);

  const registerStep = useCallback(({ id, ref, title, note }) => {
    setRegistry((prev) => ({ ...prev, [id]: { ref, title, note } }));
  }, []);

  const steps = useMemo(
    () =>
      stepDefs.map((s, index) => ({
        order: index,
        ...s,
        ...(registry[s.id] || {}),
      })),
    [stepDefs, registry],
  );

  const start = useCallback(() => {
    if (steps.length === 0) return;
    const first = steps[0];
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
  const currentRef = currentStep?.ref;

  return (
    <TourContext.Provider value={{ registerStep, start, next, stop, currentStep }}>
      {children}
      <TourOverlay step={currentStep} targetRef={currentRef} />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
