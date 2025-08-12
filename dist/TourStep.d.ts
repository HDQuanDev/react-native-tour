import React from 'react';
import type { TourStepConfig } from './types';
interface Props extends TourStepConfig {
    children: React.ReactNode;
}
declare const TourStep: React.FC<Props>;
export default TourStep;
