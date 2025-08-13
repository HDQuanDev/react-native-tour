import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import Svg, { Rect, Mask } from 'react-native-svg';
import RootSiblings from 'react-native-root-siblings';
import { useTour } from './TourContext';

const getThemeStyles = (theme) => {
  if (theme === 'dark') {
    return {
      tooltip: {
        backgroundColor: '#2d2d2d',
        borderColor: '#555',
        borderWidth: 1,
      },
      arrow: {
        backgroundColor: '#2d2d2d',
      },
      title: {
        color: '#fff',
      },
      text: {
        color: '#e0e0e0',
      },
      countdown: {
        color: '#aaa',
      },
      button: {
        backgroundColor: '#bb86fc',
      },
      buttonText: {
        color: '#000',
      },
      skipButton: {
        backgroundColor: 'transparent',
      },
      skipButtonText: {
        color: '#666',
      },
      nextButtonText: {
        color: '#4CAF50', // Xanh lá
      },
    };
  }
  
  // Light theme (default)
  return {
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
    },
    arrow: {
      backgroundColor: '#fff',
    },
    title: {
      color: '#000',
    },
    text: {
      color: '#000',
    },
    countdown: {
      color: '#666',
    },
    button: {
      backgroundColor: '#6200ee',
    },
    buttonText: {
      color: '#fff',
    },
    skipButton: {
      backgroundColor: 'transparent',
    },
    skipButtonText: {
      color: '#999',
    },
    nextButtonText: {
      color: '#4CAF50', // Xanh lá
    },
  };
};

// Component để block touch events khi đang transition
const TransitionBlocker = () => {
  return (
    <View 
      style={[StyleSheet.absoluteFill, { 
        zIndex: 999999999,
        backgroundColor: 'transparent'
      }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={() => {}} // Block tất cả touch events
      onResponderMove={() => {}}
      onResponderTerminationRequest={() => false}
      pointerEvents="auto"
    />
  );
};

const TourOverlay = ({ step, targetRef, onStepPress, loopCount = 0, useRootSiblings = false }) => {
  const { next, stop, currentIndex, totalSteps } = useTour();
  // Handle null case for currentIndex
  const safeCurrentIndex = currentIndex !== null ? currentIndex : 0;
  const [layout, setLayout] = useState(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [rootSibling, setRootSibling] = useState(null);
  const [transitionBlockerSibling, setTransitionBlockerSibling] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to handle overlay press - same as "Tiếp theo" button
  const handleOverlayPress = () => {
    // Không làm gì nếu đang transition
    if (isTransitioning) return;
    
    // Set transitioning state
    setIsTransitioning(true);
    
    // Gọi onPress của step hiện tại nếu có
    if (step?.onPress) {
      step.onPress();
    }
    // Sau đó next
    next();
    
    // Reset transitioning sau một khoảng thời gian
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // 1 giây để đảm bảo transition hoàn thành
  };

  useEffect(() => {
    if (targetRef?.current) {
      InteractionManager.runAfterInteractions(() => {
        scrollElementIntoViewAuto();
        
        setTimeout(() => {
          targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setLayout({ x: pageX, y: pageY, width, height });
          });
        }, 300);
      });
    } else {
      setLayout(null);
    }
  }, [targetRef, step]);

  // Effect để detect khi step thay đổi và set transitioning
  useEffect(() => {
    if (step && currentIndex !== null) {
      setIsTransitioning(true);
      // Reset sau khi component đã render xong
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // 500ms để đảm bảo layout đã ổn định
      
      return () => clearTimeout(timer);
    }
  }, [step?.id, currentIndex]);

  // Effect để manage TransitionBlocker cho root siblings mode
  useEffect(() => {
    if (!useRootSiblings) return;
    
    if (isTransitioning) {
      // Tạo transition blocker
      const blockerContent = <TransitionBlocker />;
      if (transitionBlockerSibling) {
        transitionBlockerSibling.update(blockerContent);
      } else {
        setTransitionBlockerSibling(new RootSiblings(blockerContent));
      }
    } else {
      // Xóa transition blocker
      if (transitionBlockerSibling) {
        transitionBlockerSibling.destroy();
        setTransitionBlockerSibling(null);
      }
    }
    
    return () => {
      if (transitionBlockerSibling) {
        transitionBlockerSibling.destroy();
        setTransitionBlockerSibling(null);
      }
    };
  }, [useRootSiblings, isTransitioning]);

  const scrollElementIntoViewAuto = () => {
    if (!targetRef?.current) return;

    try {
      targetRef.current.measureInWindow((x, y, width, height) => {
        const { height: screenHeight } = Dimensions.get('window');
        const topMargin = 100;
        const bottomMargin = 150;
        const elementTop = y;
        const elementBottom = y + height;
        const needsScrolling = elementTop < topMargin || elementBottom > (screenHeight - bottomMargin);
        
        if (needsScrolling) {
          scrollIntoView(elementTop, elementBottom, screenHeight, topMargin, bottomMargin);
        }
      });
    } catch (error) {
      // Silent fail for auto-scroll
    }
  };

  const scrollIntoView = (elementTop, elementBottom, screenHeight, topMargin, bottomMargin) => {
    try {
      let targetScrollY = 0;
      
      if (elementTop < topMargin) {
        targetScrollY = elementTop - topMargin;
      } else if (elementBottom > (screenHeight - bottomMargin)) {
        targetScrollY = elementBottom - screenHeight + bottomMargin;
      }
      
      if (global.scrollTo) {
        global.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      } else if (targetRef?.current) {
        const element = targetRef.current;
        if (element.focus && typeof element.focus === 'function') {
          element.focus();
        }
      }
    } catch (error) {
      // Silent fail for scroll
    }
  };

  useEffect(() => {
    if (step?.autoDelay && step.autoDelay > 0) {
      setCountdown(step.autoDelay);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(null);
    }
  }, [step?.autoDelay, step?.id]);

  // Always call this useEffect - manage root siblings
  useEffect(() => {
    console.log('TourOverlay useEffect:', { useRootSiblings, step: !!step, layout: !!layout });
    
    if (!useRootSiblings) {
      return;
    }

    if (step && layout) {
      console.log('Creating root sibling overlay...', step.id);
      // Create overlay content
      const theme = step.theme || 'light';
      const themeStyles = getThemeStyles(theme);

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

      const overlayContent = (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999999 }]} pointerEvents="box-none">
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

          {/* Block gestures outside highlighted area */}
          <View
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: layout.y }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={() => handleOverlayPress()}
            onResponderMove={() => {}}
            onResponderTerminationRequest={() => false}
          />
          
          <View
            style={{ position: 'absolute', left: 0, right: 0, top: layout.y + layout.height, bottom: 0 }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={() => handleOverlayPress()}
            onResponderMove={() => {}}
            onResponderTerminationRequest={() => false}
          />
          
          <View
            style={{ position: 'absolute', left: 0, top: layout.y, width: layout.x, height: layout.height }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={() => handleOverlayPress()}
            onResponderMove={() => {}}
            onResponderTerminationRequest={() => false}
          />
          
          <View
            style={{
              position: 'absolute',
              left: layout.x + layout.width,
              right: 0,
              top: layout.y,
              height: layout.height,
            }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={() => handleOverlayPress()}
            onResponderMove={() => {}}
            onResponderTerminationRequest={() => false}
          />

          {/* Highlighted area touch handler */}
          <View
            style={{
              position: 'absolute',
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
              zIndex: 10000,
            }}
            onStartShouldSetResponder={() => true}
            onResponderGrant={(evt) => {
              if (onStepPress) {
                onStepPress(evt);
              }
            }}
            onResponderTerminationRequest={() => false}
          />

          {/* Highlight border */}
          <View
            pointerEvents="none"
            style={[
              styles.highlight,
              { left: layout.x, top: layout.y, width: layout.width, height: layout.height },
            ]}
          />
          
          {/* Tooltip */}
          <View
            pointerEvents="none"
            style={[styles.arrow, themeStyles.arrow, { top: arrowTop, left: arrowLeft }]}
          />
          <View
            pointerEvents="auto"
            onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
            style={[styles.tooltip, themeStyles.tooltip, { top: tooltipTop, left: tooltipLeft }]}
          >
            {/* Loop Counter */}
            {loopCount > 0 && (
              <View style={styles.loopCounter}>
                <Text style={[styles.loopText, themeStyles.countdown]}>
                  🔄 Lần {loopCount}
                </Text>
              </View>
            )}
            
            {step.title ? (
              <Text style={[styles.tooltipTitle, themeStyles.title]}>{step.title}</Text>
            ) : null}
            {step.note ? (
              <Text style={[styles.tooltipText, themeStyles.text]}>{step.note}</Text>
            ) : null}
            {countdown !== null ? (
              <Text style={[styles.countdownText, themeStyles.countdown]}>
                Tự động chuyển sau {countdown} giây...
              </Text>
            ) : null}
            
            {(!step.autoDelay || step.autoDelay <= 0) && step.continueText ? (
              <TouchableOpacity 
                style={[styles.continueButton, themeStyles.button]}
                onPress={() => onStepPress?.()}
                activeOpacity={0.7}
              >
                <Text style={[styles.continueButtonText, themeStyles.buttonText]}>
                  {step.continueText}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Buttons Row */}
            {(!step.autoDelay || step.autoDelay <= 0) && (
              <View style={styles.buttonsContainer}>
                {/* Skip Button - chỉ hiển thị khi đã qua bước đầu */}
                {safeCurrentIndex > 0 && (
                  <TouchableOpacity 
                    onPress={() => {
                      if (isTransitioning) return; // Không làm gì nếu đang transition
                      stop();
                    }}
                    activeOpacity={0.7}
                    disabled={isTransitioning}
                  >
                    <Text style={[
                      styles.skipButtonText, 
                      themeStyles.skipButtonText,
                      isTransitioning && { opacity: 0.5 }
                    ]}>
                      Bỏ qua
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Next Button - không hiển thị ở bước cuối */}
                {safeCurrentIndex < totalSteps - 1 && (
                  <TouchableOpacity 
                    onPress={() => {
                      if (isTransitioning) return; // Không làm gì nếu đang transition
                      handleOverlayPress(); // Sử dụng function đã có logic transition
                    }}
                    activeOpacity={0.7}
                    disabled={isTransitioning}
                  >
                    <Text style={[
                      styles.nextButtonText, 
                      themeStyles.nextButtonText,
                      isTransitioning && { opacity: 0.5 }
                    ]}>
                      Tiếp theo
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      );
      
      // Create or update root sibling
      if (rootSibling) {
        console.log('Updating existing root sibling...');
        rootSibling.update(overlayContent);
      } else {
        console.log('Creating new root sibling...');
        setRootSibling(new RootSiblings(overlayContent));
      }
    } else {
      console.log('Destroying root sibling...', { step: !!step, layout: !!layout });
      // Destroy root sibling when no step or layout
      if (rootSibling) {
        rootSibling.destroy();
        setRootSibling(null);
      }
    }
    
    // Cleanup function
    return () => {
      if (rootSibling) {
        rootSibling.destroy();
        setRootSibling(null);
      }
    };
  }, [useRootSiblings, step, layout, countdown, tooltipHeight, loopCount, safeCurrentIndex, totalSteps, next, stop, onStepPress, handleOverlayPress]);

  // If using root siblings, don't render normally
  if (useRootSiblings) {
    return null;
  }

  // Regular render for non-root siblings mode
  if (!step || !layout) {
    return null;
  }

  const theme = step.theme || 'light';
  const themeStyles = getThemeStyles(theme);

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
    <>
      {/* Transition Blocker - hiển thị khi đang transition */}
      {isTransitioning && <TransitionBlocker />}
      
      <View style={[StyleSheet.absoluteFill, { zIndex: 999999 }]} pointerEvents="box-none">
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

      {/* Block gestures outside highlighted area */}
      <View
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: layout.y }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={() => handleOverlayPress()}
        onResponderMove={() => {}}
        onResponderTerminationRequest={() => false}
      />
      
      <View
        style={{ position: 'absolute', left: 0, right: 0, top: layout.y + layout.height, bottom: 0 }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={() => handleOverlayPress()}
        onResponderMove={() => {}}
        onResponderTerminationRequest={() => false}
      />
      
      <View
        style={{ position: 'absolute', left: 0, top: layout.y, width: layout.x, height: layout.height }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={() => handleOverlayPress()}
        onResponderMove={() => {}}
        onResponderTerminationRequest={() => false}
      />
      
      <View
        style={{
          position: 'absolute',
          left: layout.x + layout.width,
          right: 0,
          top: layout.y,
          height: layout.height,
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={() => handleOverlayPress()}
        onResponderMove={() => {}}
        onResponderTerminationRequest={() => false}
      />

      {/* Highlighted area touch handler */}
      <View
        style={{
          position: 'absolute',
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
          zIndex: 10000,
        }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(evt) => {
          if (onStepPress) {
            onStepPress(evt);
          }
        }}
        onResponderTerminationRequest={() => false}
      />

      {/* Highlight border */}
      <View
        pointerEvents="none"
        style={[
          styles.highlight,
          { left: layout.x, top: layout.y, width: layout.width, height: layout.height },
        ]}
      />
      
      {/* Tooltip */}
      <View
        pointerEvents="none"
        style={[styles.arrow, themeStyles.arrow, { top: arrowTop, left: arrowLeft }]}
      />
      <View
        pointerEvents="auto"
        onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
        style={[styles.tooltip, themeStyles.tooltip, { top: tooltipTop, left: tooltipLeft }]}
      >
        {/* Loop Counter */}
        {loopCount > 0 && (
          <View style={styles.loopCounter}>
            <Text style={[styles.loopText, themeStyles.countdown]}>
              🔄 Lần {loopCount}
            </Text>
          </View>
        )}
        
        {step.title ? (
          <Text style={[styles.tooltipTitle, themeStyles.title]}>{step.title}</Text>
        ) : null}
        {step.note ? (
          <Text style={[styles.tooltipText, themeStyles.text]}>{step.note}</Text>
        ) : null}
        {countdown !== null ? (
          <Text style={[styles.countdownText, themeStyles.countdown]}>
            Tự động chuyển sau {countdown} giây...
          </Text>
        ) : null}
        
        {(!step.autoDelay || step.autoDelay <= 0) && step.continueText ? (
          <TouchableOpacity 
            style={[styles.continueButton, themeStyles.button]}
            onPress={() => onStepPress?.()}
            activeOpacity={0.7}
          >
            <Text style={[styles.continueButtonText, themeStyles.buttonText]}>
              {step.continueText}
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* Buttons Row */}
        {(!step.autoDelay || step.autoDelay <= 0) && (
          <View style={styles.buttonsContainer}>
            {/* Skip Button - chỉ hiển thị khi đã qua bước đầu */}
            {safeCurrentIndex > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  if (isTransitioning) return; // Không làm gì nếu đang transition
                  stop();
                }}
                activeOpacity={0.7}
                disabled={isTransitioning}
              >
                <Text style={[
                  styles.skipButtonText, 
                  themeStyles.skipButtonText,
                  isTransitioning && { opacity: 0.5 }
                ]}>
                  Bỏ qua
                </Text>
              </TouchableOpacity>
            )}

            {/* Next Button - không hiển thị ở bước cuối */}
            {safeCurrentIndex < totalSteps - 1 && (
              <TouchableOpacity 
                onPress={() => {
                  if (isTransitioning) return; // Không làm gì nếu đang transition
                  handleOverlayPress(); // Sử dụng function đã có logic transition
                }}
                activeOpacity={0.7}
                disabled={isTransitioning}
              >
                <Text style={[
                  styles.nextButtonText, 
                  themeStyles.nextButtonText,
                  isTransitioning && { opacity: 0.5 }
                ]}>
                  Tiếp theo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
    </>
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
    padding: 8,
    borderRadius: 4,
    maxWidth: 260,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  countdownText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loopCounter: {
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 150, 255, 0.1)',
  },
  loopText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default TourOverlay;
