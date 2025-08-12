import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  InteractionManager,
} from 'react-native';
import Svg, { Rect, Mask } from 'react-native-svg';

const TourOverlay = ({ step, targetRef }) => {
  const [layout, setLayout] = useState(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    if (targetRef?.current) {
      InteractionManager.runAfterInteractions(() => {
        targetRef.current?.measureInWindow((x, y, width, height) => {
          setLayout({ x, y, width, height });
        });
      });
    } else {
      setLayout(null);
    }
  }, [targetRef, step]);

  if (!step || !layout) {
    return null;
  }

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const tooltipLeft = Math.min(layout.x, screenWidth - 260);
  const arrowLeft = Math.min(
    Math.max(layout.x + layout.width / 2 - 6, 0),
    screenWidth - 12,
  );

  let tooltipTop = layout.y + layout.height + 8;
  let arrowTop = layout.y + layout.height;
  if (layout.y + layout.height + tooltipHeight + 20 > screenHeight) {
    tooltipTop = Math.max(layout.y - tooltipHeight - 8, 0);
    arrowTop = layout.y - 12;
  }

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]} pointerEvents="box-none">
      <Svg width="100%" height="100%" pointerEvents="none">
        <Mask id="mask">
          <Rect width="100%" height="100%" fill="#fff" />
          <Rect
            x={layout.x}
            y={layout.y}
            width={layout.width}
            height={layout.height}
            rx={8}
            ry={8}
            fill="#000"
          />
        </Mask>
        <Rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)" />
      </Svg>

      {/* Block taps outside the highlighted area */}
      <Pressable
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: layout.y }}
        onPress={() => {}}
      />
      <Pressable
        style={{ position: 'absolute', left: 0, right: 0, top: layout.y + layout.height, bottom: 0 }}
        onPress={() => {}}
      />
      <Pressable
        style={{ position: 'absolute', left: 0, top: layout.y, width: layout.x, height: layout.height }}
        onPress={() => {}}
      />
      <Pressable
        style={{
          position: 'absolute',
          left: layout.x + layout.width,
          right: 0,
          top: layout.y,
          height: layout.height,
        }}
        onPress={() => {}}
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
        style={[styles.arrow, { top: arrowTop, left: arrowLeft }]}
      />
      <View
        pointerEvents="none"
        onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
        style={[styles.tooltip, { top: tooltipTop, left: tooltipLeft }]}
      >
        {step.title ? <Text style={styles.tooltipTitle}>{step.title}</Text> : null}
        {step.note ? <Text style={styles.tooltipText}>{step.note}</Text> : null}
      </View>
    </View>
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
