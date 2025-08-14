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
        wrapperRef.current.measure((x, y, width, height, pageX, pageY) => {
          if (pageX >= 0 && pageY >= 0 && width > 0 && height > 0) {
            callback(x, y, width, height, pageX, pageY);
          } else {
            const nodeHandle = findNodeHandle(wrapperRef.current);
            if (nodeHandle) {
              UIManager.measure(nodeHandle, callback);
            }
          }
        });
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
        wrapperRef.current.measureInWindow((x, y, width, height) => {
          if (x >= 0 && y >= 0 && width > 0 && height > 0) {
            callback(x, y, width, height);
          } else {
            const nodeHandle = findNodeHandle(wrapperRef.current);
            if (nodeHandle) {
              UIManager.measureInWindow(nodeHandle, callback);
            }
          }
        });
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
        style: undefined,
      })}
    </View>
  );
};

export default TourStep;