"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const AnimatedRect = react_native_1.Animated.createAnimatedComponent(react_native_svg_1.Rect);
const TourOverlay = ({ step, targetRef, onNext }) => {
    const [layout, setLayout] = (0, react_1.useState)(null);
    const anim = (0, react_1.useRef)({
        x: new react_native_1.Animated.Value(0),
        y: new react_native_1.Animated.Value(0),
        width: new react_native_1.Animated.Value(0),
        height: new react_native_1.Animated.Value(0),
        opacity: new react_native_1.Animated.Value(0),
    }).current;
    (0, react_1.useEffect)(() => {
        if (targetRef === null || targetRef === void 0 ? void 0 : targetRef.current) {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                var _a;
                (_a = targetRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow((x, y, width, height) => {
                    setLayout({ x, y, width, height });
                    react_native_1.Animated.parallel([
                        react_native_1.Animated.timing(anim.x, { toValue: x, duration: 250, useNativeDriver: false }),
                        react_native_1.Animated.timing(anim.y, { toValue: y, duration: 250, useNativeDriver: false }),
                        react_native_1.Animated.timing(anim.width, { toValue: width, duration: 250, useNativeDriver: false }),
                        react_native_1.Animated.timing(anim.height, { toValue: height, duration: 250, useNativeDriver: false }),
                        react_native_1.Animated.timing(anim.opacity, { toValue: 1, duration: 250, useNativeDriver: false }),
                    ]).start();
                });
            });
        }
        else {
            setLayout(null);
        }
    }, [targetRef, anim]);
    if (!step || !layout) {
        return null;
    }
    const screenWidth = react_native_1.Dimensions.get('window').width;
    const tooltipLeft = Math.min(layout.x, screenWidth - 260);
    return (react_1.default.createElement(react_native_1.Modal, { transparent: true, visible: true },
        react_1.default.createElement(react_native_1.Animated.View, { style: [react_native_1.StyleSheet.absoluteFill, { opacity: anim.opacity }], pointerEvents: "box-none" },
            react_1.default.createElement(react_native_svg_1.default, { width: "100%", height: "100%" },
                react_1.default.createElement(react_native_svg_1.Mask, { id: "mask" },
                    react_1.default.createElement(react_native_svg_1.Rect, { width: "100%", height: "100%", fill: "#fff" }),
                    react_1.default.createElement(AnimatedRect, { x: anim.x, y: anim.y, width: anim.width, height: anim.height, rx: 8, ry: 8, fill: "#000" })),
                react_1.default.createElement(react_native_svg_1.Rect, { width: "100%", height: "100%", fill: "rgba(0,0,0,0.6)", mask: "url(#mask)" })),
            react_1.default.createElement(react_native_1.Pressable, { style: [
                    styles.highlight,
                    { left: layout.x, top: layout.y, width: layout.width, height: layout.height },
                ], onPress: onNext }),
            react_1.default.createElement(react_native_1.View, { style: [styles.tooltip, { top: layout.y + layout.height + 8, left: tooltipLeft }] },
                react_1.default.createElement(react_native_1.Text, { style: styles.tooltipText }, step.text)))));
};
const styles = react_native_1.StyleSheet.create({
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
exports.default = TourOverlay;
