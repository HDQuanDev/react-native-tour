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
  const arrowLeft = Math.min(
    Math.max(layout.x + layout.width / 2 - 6, 0),
    screenWidth - 12,
  );

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
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: layout.y }}
          onPress={onNext}
        />
        <Pressable
          style={{ position: 'absolute', left: 0, right: 0, top: layout.y + layout.height, bottom: 0 }}
          onPress={onNext}
        />
        <Pressable
          style={{ position: 'absolute', left: 0, top: layout.y, width: layout.x, height: layout.height }}
          onPress={onNext}
        />
        <Pressable
          style={{
            position: 'absolute',
            left: layout.x + layout.width,
            right: 0,
            top: layout.y,
            height: layout.height,
          }}
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
        <View
          pointerEvents="none"
          style={[styles.arrow, { top: layout.y + layout.height, left: arrowLeft }]}
        />
        <View
          pointerEvents="none"
          style={[styles.tooltip, { top: layout.y + layout.height + 8, left: tooltipLeft }]}
        >
          {step.title ? <Text style={styles.tooltipTitle}>{step.title}</Text> : null}
          {step.note ? <Text style={styles.tooltipText}>{step.note}</Text> : null}
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
  arrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
  tooltipTitle: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  tooltipText: {
    color: '#000',
  },
});

export default TourOverlay;
