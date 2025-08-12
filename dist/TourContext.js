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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTour = exports.TourProvider = exports.TourContext = void 0;
const react_1 = __importStar(require("react"));
const TourOverlay_1 = __importDefault(require("./TourOverlay"));
exports.TourContext = (0, react_1.createContext)({
    registerStep: () => { },
    start: () => { },
    next: () => { },
    stop: () => { },
    currentStep: undefined,
});
const TourProvider = ({ children, steps, onNavigate }) => {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(null);
    const [refs, setRefs] = (0, react_1.useState)({});
    const registerStep = (0, react_1.useCallback)((id, ref) => {
        setRefs((prev) => (Object.assign(Object.assign({}, prev), { [id]: ref })));
    }, []);
    const sortedSteps = (0, react_1.useMemo)(() => [...steps].sort((a, b) => a.order - b.order), [steps]);
    const start = (0, react_1.useCallback)(() => {
        if (sortedSteps.length === 0)
            return;
        const first = sortedSteps[0];
        if (first.screen && onNavigate)
            onNavigate(first.screen);
        setCurrentIndex(0);
    }, [sortedSteps, onNavigate]);
    const next = (0, react_1.useCallback)(() => {
        if (currentIndex === null)
            return;
        const nextIndex = currentIndex + 1;
        if (nextIndex < sortedSteps.length) {
            const step = sortedSteps[nextIndex];
            if (step.screen && onNavigate)
                onNavigate(step.screen);
            setCurrentIndex(nextIndex);
        }
        else {
            setCurrentIndex(null);
        }
    }, [currentIndex, sortedSteps, onNavigate]);
    const stop = (0, react_1.useCallback)(() => setCurrentIndex(null), []);
    const currentStep = currentIndex === null ? undefined : sortedSteps[currentIndex];
    const currentRef = currentStep ? refs[currentStep.id] : undefined;
    return (react_1.default.createElement(exports.TourContext.Provider, { value: { registerStep, start, next, stop, currentStep } },
        children,
        react_1.default.createElement(TourOverlay_1.default, { step: currentStep, targetRef: currentRef, onNext: next })));
};
exports.TourProvider = TourProvider;
const useTour = () => (0, react_1.useContext)(exports.TourContext);
exports.useTour = useTour;
