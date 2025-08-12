import React from 'react';
import type { MutableRefObject } from 'react';
import type { TourStepConfig } from './types';
interface TourOverlayProps {
    step?: TourStepConfig;
    targetRef?: MutableRefObject<any>;
    onNext: () => void;
}
declare const TourOverlay: React.FC<TourOverlayProps>;
export default TourOverlay;
