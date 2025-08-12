import React from 'react';
import type { RegisteredStep } from './types';
interface TourContextValue {
    registerStep: (step: RegisteredStep) => void;
    start: () => void;
    next: () => void;
    stop: () => void;
    currentStep?: RegisteredStep;
}
export declare const TourContext: React.Context<TourContextValue>;
interface TourProviderProps {
    children: React.ReactNode;
    /**
     * Called when a step points to a different screen. Implement with your navigation lib.
     */
    onNavigate?: (screen: string) => void;
}
export declare const TourProvider: React.FC<TourProviderProps>;
export declare const useTour: () => TourContextValue;
export {};
