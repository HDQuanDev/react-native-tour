import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { findNodeHandle, UIManager, View } from 'react-native';
import { TourContext } from './TourContext';

const TourStep = ({ id, title, note, onPress, autoDelay, continueText, theme, children }) => {
  const wrapperRef = useRef(null);
  const { registerStep, currentStep } = useContext(TourContext);
  const child = React.Children.only(children);
  const childOnPress = child.props.onPress;

  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  const measureableRef = useRef({
    current: null,
    measure: (callback) => {
      if (!wrapperRef.current) {
        return;
      }
      try {
        wrapperRef.current.measure(callback);
      } catch (error) {
        const nodeHandle = findNodeHandle(wrapperRef.current);
        if (nodeHandle) {
          UIManager.measure(nodeHandle, callback);
        }
      }
    },
    measureInWindow: (callback) => {
      if (!wrapperRef.current) {
        return;
      }
      try {
        wrapperRef.current.measureInWindow(callback);
      } catch (error) {
        const nodeHandle = findNodeHandle(wrapperRef.current);
        if (nodeHandle) {
          UIManager.measureInWindow(nodeHandle, callback);
        }
      }
    }
  });

  useEffect(() => {
    measureableRef.current.current = wrapperRef.current;
  });

  useEffect(() => {
    registerStep({ 
      id, 
      ref: measureableRef,
      title, 
      note,
      autoDelay,
      continueText,
      theme,
      onPress: () => onPressRef.current?.()
    });
  }, [id, title, note, autoDelay, continueText, theme, registerStep]);

  const handlePress = useCallback((...args) => {
    if (currentStep?.id !== id && childOnPress) {
      childOnPress(...args);
    }
  }, [currentStep?.id, id, childOnPress]);

  return (
    <View
      ref={wrapperRef}
      collapsable={false}
      style={[
        // Inherit tất cả style từ child để layout giống hệt
        child.props.style,
        { 
          opacity: currentStep?.id === id ? 0.3 : 1,
        }
      ]}
      pointerEvents={currentStep?.id === id ? 'none' : 'auto'}
    >
      {React.cloneElement(child, {
        ...child.props,
        onPress: handlePress,
        // Reset style của child để tránh duplicate với wrapper
        style: undefined,
      })}
    </View>
  );
};

export default TourStep;