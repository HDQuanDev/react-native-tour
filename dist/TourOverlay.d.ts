import React from 'react';
import type { RegisteredStep } from './types';
interface TourOverlayProps {
    step?: RegisteredStep;
    onNext: () => void;
}
declare const TourOverlay: React.FC<TourOverlayProps>;
export default TourOverlay;
