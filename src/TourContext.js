import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';
import TourOverlay from './TourOverlay';

export const TourContext = createContext({
  registerStep: () => {},
  start: () => {},
  next: () => {},
  stop: () => {},
  currentStep: undefined,
  setLoop: () => {},
  isLooping: false,
  forceRefresh: () => {},
  forceMeasure: () => {},
});

export const TourProvider = ({ children, steps: stepDefs = [], onNavigate, useRootSiblings = false }) => {
  const [registry, setRegistry] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const overlayRef = useRef(null);

  const registerStep = useCallback(({ id, ref, title, note, onPress, autoDelay, continueText, theme }) => {
    setRegistry((prev) => ({ ...prev, [id]: { ref, title, note, onPress, autoDelay, continueText, theme } }));
  }, []);

  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const forceMeasure = useCallback(() => {
    if (overlayRef.current?.forceMeasure) {
      overlayRef.current.forceMeasure();
    }
  }, []);

  const steps = useMemo(
    () =>
      stepDefs.map((s, index) => {
        const registered = registry[s.id] || {};
        return {
          order: index,
          ...s,
          ...(registered.title !== undefined && { title: registered.title }),
          ...(registered.note !== undefined && { note: registered.note }),
          ...(registered.theme !== undefined && { theme: registered.theme }),
          ...(registered.autoDelay !== undefined && { autoDelay: registered.autoDelay }),
          ...(registered.continueText !== undefined && { continueText: registered.continueText }),
          ...(registered.ref && { ref: registered.ref }),
          ...(registered.onPress && { onPress: registered.onPress }),
        };
      }),
    [stepDefs, registry],
  );

  const start = useCallback(async (loop = false) => {
    const currentSteps = stepDefs.map((s, index) => {
      const registered = registry[s.id] || {};
      return {
        order: index,
        ...s,
        ...(registered.title !== undefined && { title: registered.title }),
        ...(registered.note !== undefined && { note: registered.note }),
        ...(registered.theme !== undefined && { theme: registered.theme }),
        ...(registered.autoDelay !== undefined && { autoDelay: registered.autoDelay }),
        ...(registered.continueText !== undefined && { continueText: registered.continueText }),
        ...(registered.ref && { ref: registered.ref }),
        ...(registered.onPress && { onPress: registered.onPress }),
      };
    });
    
    if (currentSteps.length === 0) return;
    
    setIsLooping(loop);
    setLoopCount(0);
    const first = currentSteps[0];
    
    if (first.screen && onNavigate) {
      onNavigate(first.screen);
    }
    
    const firstStepWithRef = currentSteps.find(step => step.ref);
    
    if (!firstStepWithRef) {
      setCurrentIndex(0);
      return;
    }
    
    const waitForLayout = () => {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkLayout = () => {
          attempts++;
          
          if (!first.ref?.current) {
            if (attempts >= maxAttempts) {
              resolve();
              return;
            }
            setTimeout(checkLayout, 100);
            return;
          }
          
          first.ref.current.measure((x, y, width, height, pageX, pageY) => {
            const isValidLayout = pageX >= 0 && pageY >= 0 && width > 0 && height > 0;
            
            if (isValidLayout) {
              resolve();
            } else if (attempts >= maxAttempts) {
              resolve();
            } else {
              setTimeout(checkLayout, 100);
            }
          });
        };
        setTimeout(checkLayout, 50);
      });
    };
    
    await waitForLayout();
    
    setCurrentIndex(0);
  }, [stepDefs, registry, onNavigate]);

  const next = useCallback(() => {
    if (currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    
    const currentSteps = stepDefs.map((s, index) => {
      const registered = registry[s.id] || {};
      return {
        order: index,
        ...s,
        ...(registered.title !== undefined && { title: registered.title }),
        ...(registered.note !== undefined && { note: registered.note }),
        ...(registered.theme !== undefined && { theme: registered.theme }),
        ...(registered.autoDelay !== undefined && { autoDelay: registered.autoDelay }),
        ...(registered.continueText !== undefined && { continueText: registered.continueText }),
        ...(registered.ref && { ref: registered.ref }),
        ...(registered.onPress && { onPress: registered.onPress }),
      };
    });
    
    if (nextIndex < currentSteps.length) {
      const step = currentSteps[nextIndex];
      if (step.screen && onNavigate) onNavigate(step.screen);
      setCurrentIndex(nextIndex);
    } else {
      if (isLooping) {
        const newLoopCount = loopCount + 1;
        setLoopCount(newLoopCount);
        
        const first = currentSteps[0];
        if (first.screen && onNavigate) onNavigate(first.screen);
        setCurrentIndex(0);
      } else {
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
    const currentSteps = stepDefs.map((s, index) => {
      const registered = registry[s.id] || {};
      return {
        order: index,
        ...s,
        ...(registered.title !== undefined && { title: registered.title }),
        ...(registered.note !== undefined && { note: registered.note }),
        ...(registered.theme !== undefined && { theme: registered.theme }),
        ...(registered.autoDelay !== undefined && { autoDelay: registered.autoDelay }),
        ...(registered.continueText !== undefined && { continueText: registered.continueText }),
        ...(registered.ref && { ref: registered.ref }),
        ...(registered.onPress && { onPress: registered.onPress }),
      };
    });
    
    const step = currentIndex === null ? undefined : currentSteps[currentIndex];
    
    if (step?.autoDelay && step.autoDelay > 0) {
      return;
    }
    
    if (step?.onPress) {
      step.onPress(evt);
    }
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
      loopCount,
      currentIndex,
      totalSteps: steps.length,
      forceRefresh,
      forceMeasure
    }}>
      {children}
      <TourOverlay 
        ref={overlayRef}
        key={refreshKey}
        step={currentStep} 
        targetRef={currentRef} 
        onStepPress={handleStepPress}
        loopCount={loopCount}
        useRootSiblings={useRootSiblings}
      />
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
