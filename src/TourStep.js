import React, { useContext, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, order, onPress, screen, children }) => {
  const ref = useRef(null);
  const { registerStep, currentStep, next } = useContext(TourContext);
  const child = React.Children.only(children);

  useEffect(() => {
    registerStep({ id, ref, title, note, order, screen });
  }, [id, title, note, order, screen, registerStep]);

  const handlePress = (...args) => {
    if (child.props?.onPress) child.props.onPress(...args);
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
