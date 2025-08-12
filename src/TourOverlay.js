import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  InteractionManager,
  Animated,
} from 'react-native';
import Svg, { Rect, Mask } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const TourOverlay = ({ step, targetRef, onNext }) => {
  const [layout, setLayout] = useState(null);

  const anim = useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    width: new Animated.Value(0),
    height: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }).current;

  useEffect(() => {
    if (targetRef?.current) {
      InteractionManager.runAfterInteractions(() => {
        targetRef.current?.measureInWindow((x, y, width, height) => {
          setLayout({ x, y, width, height });
          Animated.parallel([
            Animated.timing(anim.x, { toValue: x, duration: 250, useNativeDriver: false }),
            Animated.timing(anim.y, { toValue: y, duration: 250, useNativeDriver: false }),
            Animated.timing(anim.width, { toValue: width, duration: 250, useNativeDriver: false }),
            Animated.timing(anim.height, { toValue: height, duration: 250, useNativeDriver: false }),
            Animated.timing(anim.opacity, { toValue: 1, duration: 250, useNativeDriver: false }),
          ]).start();
        });
      });
    } else {
      setLayout(null);
    }
  }, [targetRef, anim]);

  if (!step || !layout) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;
  const tooltipLeft = Math.min(layout.x, screenWidth - 260);

  return (
    <Modal transparent visible>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: anim.opacity }]} pointerEvents="box-none">
        <Svg width="100%" height="100%" pointerEvents="none">
          <Mask id="mask">
            <Rect width="100%" height="100%" fill="#fff" />
            <AnimatedRect
              x={anim.x}
              y={anim.y}
              width={anim.width}
              height={anim.height}
              rx={8}
              ry={8}
              fill="#000"
            />
          </Mask>
          <Rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)" />
        </Svg>

        {/* Capture taps outside the highlighted area */}
        <Pressable
          style={[StyleSheet.absoluteFill, { top: 0, height: layout.y }]}
          onPress={onNext}
        />
        <Pressable
          style={[StyleSheet.absoluteFill, { top: layout.y + layout.height, bottom: 0 }]}
          onPress={onNext}
        />
        <Pressable
          style={[StyleSheet.absoluteFill, { left: 0, width: layout.x, top: layout.y, height: layout.height }]}
          onPress={onNext}
        />
        <Pressable
          style={[StyleSheet.absoluteFill, { left: layout.x + layout.width, right: 0, top: layout.y, height: layout.height }]}
          onPress={onNext}
        />

        {/* Visible border that lets touches pass through */}
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            { left: layout.x, top: layout.y, width: layout.width, height: layout.height },
          ]}
        />
        <View pointerEvents="none" style={[styles.tooltip, { top: layout.y + layout.height + 8, left: tooltipLeft }]}>
          <Text style={styles.tooltipText}>{step.text}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    maxWidth: 260,
  },
  tooltipText: {
    color: '#000',
  },
});

export default TourOverlay;
