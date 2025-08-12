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

  const registerStep = useCallback(({ id, ref, title, note, onPress, autoDelay, continueText, theme }) => {
    setRegistry((prev) => ({ ...prev, [id]: { ref, title, note, onPress, autoDelay, continueText, theme } }));
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
    const currentSteps = stepDefs.map((s, index) => ({
      order: index,
      ...s,
      ...(registry[s.id] || {}),
    }));
    
    if (currentSteps.length === 0) return;
    const first = currentSteps[0];
    if (first.screen && onNavigate) onNavigate(first.screen);
    setCurrentIndex(0);
  }, [stepDefs, registry, onNavigate]);

  const next = useCallback(() => {
    if (currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    
    const currentSteps = stepDefs.map((s, index) => ({
      order: index,
      ...s,
      ...(registry[s.id] || {}),
    }));
    
    if (nextIndex < currentSteps.length) {
      const step = currentSteps[nextIndex];
      if (step.screen && onNavigate) onNavigate(step.screen);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(null);
    }
  }, [currentIndex, stepDefs, registry, onNavigate]);

  const stop = useCallback(() => setCurrentIndex(null), []);

  const currentStep = currentIndex === null ? undefined : steps[currentIndex];
  const currentRef = currentStep?.ref;

  const handleStepPress = useCallback((evt) => {
    // Get current step at time of press
    const currentSteps = stepDefs.map((s, index) => ({
      order: index,
      ...s,
      ...(registry[s.id] || {}),
    }));
    
    const step = currentIndex === null ? undefined : currentSteps[currentIndex];
    
    // If step has autoDelay, don't allow manual press (auto advance is handled)
    if (step?.autoDelay && step.autoDelay > 0) {
      return; // Do nothing for auto steps
    }
    
    // First call the step's onPress handler if it exists (from TourStep component or step definition)
    if (step?.onPress) {
      step.onPress(evt);
    }
    // Then proceed to next step
    next();
  }, [currentIndex, stepDefs, registry, next]);

  return (
    <TourContext.Provider value={{ registerStep, start, next, stop, currentStep }}>
      {children}
      <TourOverlay 
        step={currentStep} 
        targetRef={currentRef} 
        onStepPress={handleStepPress}
      />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
