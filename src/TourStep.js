import React, { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, children }) => {
  const ref = useRef(null);
  const { registerStep } = useContext(TourContext);

  useEffect(() => {
    registerStep(id, ref);
  }, [id, registerStep]);

  return (
    <View ref={ref} collapsable={false}>
      {children}
    </View>
  );
};

export default TourStep;
