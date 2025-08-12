import React, { useContext, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, onPress, children }) => {
  const ref = useRef(null);
  const { registerStep, currentStep, next } = useContext(TourContext);
  const child = React.Children.only(children);

  useEffect(() => {
    registerStep({ id, ref, title, note });
  }, [id, title, note, registerStep]);

  const handlePress = (...args) => {
    if (onPress) onPress(...args);
    if (currentStep?.id === id) next();
  };

  return (
    <Pressable ref={ref} collapsable={false} onPress={handlePress}>
      {React.cloneElement(child, { pointerEvents: 'none' })}
    </Pressable>
  );
};

export default TourStep;
