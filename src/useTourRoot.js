import { useRef, useCallback } from 'react';
import TourOverlayRoot from './TourOverlayRoot';

export const useTourRoot = () => {
  const tourOverlayRoot = useRef(new TourOverlayRoot()).current;

  const showTour = useCallback((step, targetRef, onStepPress, loopCount = 0) => {
    tourOverlayRoot.show(step, targetRef, onStepPress, loopCount);
  }, [tourOverlayRoot]);

  const updateTour = useCallback((step, targetRef, onStepPress, loopCount = 0) => {
    tourOverlayRoot.update(step, targetRef, onStepPress, loopCount);
  }, [tourOverlayRoot]);

  const hideTour = useCallback(() => {
    tourOverlayRoot.destroy();
  }, [tourOverlayRoot]);

  return {
    showTour,
    updateTour,
    hideTour,
  };
};

export default useTourRoot;
