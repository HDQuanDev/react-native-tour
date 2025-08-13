import { useRef, useCallback } from 'react';
import TourOverlayRoot from './TourOverlayRoot';

/**
 * Hook để sử dụng tour overlay với root siblings
 * Đặc biệt hữu ích khi cần hiển thị tour lên trên modal hoặc RBSheet
 */
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
