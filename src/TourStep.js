import React, { useContext, useEffect, useRef } from 'react';
import { View, Pressable } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, order, onPress, screen, children }) => {
  const ref = useRef(null);
  const { registerStep, currentStep, next } = useContext(TourContext);

  useEffect(() => {
    registerStep({ id, ref, title, note, order, screen });
  }, [id, title, note, order, screen, registerStep]);

  const handlePress = () => {
    if (onPress) onPress();
    if (currentStep?.id === id) next();
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container ref={ref} collapsable={false} onPress={onPress ? handlePress : undefined}>
      {children}
    </Container>
  );
};

export default TourStep;
