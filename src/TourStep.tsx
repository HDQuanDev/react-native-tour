import React, { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { TourContext } from './TourContext';
import type { TourStepConfig } from './types';

interface Props extends TourStepConfig {
  children: React.ReactNode;
}

const TourStep: React.FC<Props> = ({ id, order, text, screen, children }) => {
  const ref = useRef<View>(null);
  const { registerStep } = useContext(TourContext);

  useEffect(() => {
    registerStep({ id, order, text, screen, ref });
  }, [id, order, text, screen, registerStep]);

  return (
    <View ref={ref} collapsable={false}>
      {children}
    </View>
  );
};

export default TourStep;
