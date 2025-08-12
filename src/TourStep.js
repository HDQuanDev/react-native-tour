import React, { useContext, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, onPress, autoDelay, continueText, theme, children }) => {
  const ref = useRef(null);
  const { registerStep, currentStep, next } = useContext(TourContext);
  const child = React.Children.only(children);
  const childOnPress = child.props.onPress;
  const autoTimerRef = useRef(null);

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

  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (currentStep?.id === id && autoDelay && autoDelay > 0) {
      autoTimerRef.current = setTimeout(() => {
        next();
      }, autoDelay * 1000);
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [currentStep?.id, id, autoDelay, next]);

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
