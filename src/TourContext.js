import React, { createContext, useCallback, useContext, useMemo, useState, useRef, useEffect } from 'react';
import TourOverlay from './TourOverlay';
import TourOverlayRootWithContext from './TourOverlayRootWithContext';

export const TourContext = createContext({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
  setLoop: () => {},
  isLooping: false,
});

export const TourProvider = ({ children, steps: stepDefs = [], onNavigate, useRootSiblings = false }) => {
  const [registry, setRegistry] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const tourOverlayRoot = useRef(new TourOverlayRootWithContext()).current;

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
    
    // Small delay for root siblings to ensure components are registered
    const delay = useRootSiblings ? 50 : 0;
    setTimeout(() => {
      setIsLooping(loop);
      setLoopCount(0);
      const first = currentSteps[0];
      if (first.screen && onNavigate) onNavigate(first.screen);
      setCurrentIndex(0);
    }, delay);
  }, [stepDefs, registry, onNavigate, useRootSiblings]);

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
    if (useRootSiblings) {
      tourOverlayRoot.destroy();
    }
  }, [useRootSiblings, tourOverlayRoot]);

  const setLoop = useCallback((loop) => {
    setIsLooping(loop);
    if (!loop) {
      setLoopCount(0);
    }
  }, []);

  const currentStep = currentIndex === null ? undefined : steps[currentIndex];
  const currentRef = currentStep?.ref;

  // Context value to pass to root siblings
  const contextValue = useMemo(() => ({
    registerStep,
    start,
    next,
    stop,
    currentStep,
    setLoop,
    isLooping,
    loopCount
  }), [registerStep, start, next, stop, currentStep, setLoop, isLooping, loopCount]);

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

  // Handle root siblings overlay updates
  useEffect(() => {
    if (useRootSiblings) {
      if (currentStep && currentRef) {
        tourOverlayRoot.update(currentStep, currentRef, handleStepPress, loopCount, contextValue);
      } else {
        tourOverlayRoot.destroy();
      }
    }
  }, [currentStep, currentRef, loopCount, useRootSiblings, tourOverlayRoot, contextValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (useRootSiblings) {
        tourOverlayRoot.destroy();
      }
    };
  }, [useRootSiblings, tourOverlayRoot]);

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {!useRootSiblings && (
        <TourOverlay 
          step={currentStep} 
          targetRef={currentRef} 
          onStepPress={handleStepPress}
          loopCount={loopCount}
        />
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
