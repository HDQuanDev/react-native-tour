import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TourOverlay from './TourOverlay';

export const TourContext = createContext({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
  setLoop: () => {},
  isLooping: false,
});

export const TourProvider = ({ children, steps: stepDefs = [], onNavigate }) => {
  const [registry, setRegistry] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

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

  const start = useCallback((loop = false) => {
    const currentSteps = stepDefs.map((s, index) => ({
      order: index,
      ...s,
      ...(registry[s.id] || {}),
    }));
    
    if (currentSteps.length === 0) return;
    setIsLooping(loop);
    setLoopCount(0);
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
      // Đã hết steps
      if (isLooping) {
        // Nếu đang loop, quay về bước đầu
        const newLoopCount = loopCount + 1;
        setLoopCount(newLoopCount);
        console.log(`🔄 Tour Loop ${newLoopCount} completed, restarting...`);
        
        const first = currentSteps[0];
        if (first.screen && onNavigate) onNavigate(first.screen);
        setCurrentIndex(0);
      } else {
        // Không loop, kết thúc tour
        setCurrentIndex(null);
        setLoopCount(0);
      }
    }
  }, [currentIndex, stepDefs, registry, onNavigate, isLooping, loopCount]);

  const stop = useCallback(() => {
    setCurrentIndex(null);
    setIsLooping(false);
    setLoopCount(0);
  }, []);

  const setLoop = useCallback((loop) => {
    setIsLooping(loop);
    if (!loop) {
      setLoopCount(0);
    }
  }, []);

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
    <TourContext.Provider value={{ 
      registerStep, 
      start, 
      next, 
      stop, 
      currentStep, 
      setLoop, 
      isLooping,
      loopCount 
    }}>
      {children}
      <TourOverlay 
        step={currentStep} 
        targetRef={currentRef} 
        onStepPress={handleStepPress}
        loopCount={loopCount}
      />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
