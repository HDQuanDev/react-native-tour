import React, { useContext, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, onPress, autoDelay, continueText, theme, children }) => {
  const ref = useRef(null);
  const { registerStep, currentStep } = useContext(TourContext);
  const child = React.Children.only(children);
  const childOnPress = child.props.onPress;

  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    registerStep({ 
      id, 
      ref, 
      title, 
      note,
      autoDelay,
      continueText,
      theme,
      onPress: () => onPressRef.current?.()
    });
  }, [id, title, note, autoDelay, continueText, theme, registerStep]);

  const handlePress = (...args) => {
    if (currentStep?.id !== id && childOnPress) {
      childOnPress(...args);
    }
  };

  return (
    <Pressable ref={ref} collapsable={false} onPress={handlePress}>
      {React.cloneElement(child, { 
        pointerEvents: currentStep?.id === id ? 'none' : 'auto'
      })}
    </Pressable>
  );
};

export default TourStep;
