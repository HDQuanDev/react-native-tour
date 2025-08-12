import React from 'react';
import type { MutableRefObject } from 'react';
import type { TourStepConfig } from './types';
interface TourContextValue {
    registerStep: (id: string, ref: MutableRefObject<any>) => void;
    start: () => void;
    next: () => void;
    stop: () => void;
    currentStep?: TourStepConfig;
}
export declare const TourContext: React.Context<TourContextValue>;
interface TourProviderProps {
    children: React.ReactNode;
    steps: TourStepConfig[];
    /**
     * Called when a step points to a different screen. Implement with your navigation lib.
     */
    onNavigate?: (screen: string) => void;
}
export declare const TourProvider: React.FC<TourProviderProps>;
export declare const useTour: () => TourContextValue;
export {};
