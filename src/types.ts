import type { View } from 'react-native';
import type { MutableRefObject } from 'react';

export interface TourStepConfig {
  id: string;
  /**
   * Steps are ordered ascending by this value. Lower values appear first.
   */
  order: number;
  /** Text shown inside the tooltip. */
  text: string;
  /** Optional screen name used for navigation. */
  screen?: string;
}

export interface StepRef {
  id: string;
  ref: MutableRefObject<View | null>;
}
