/**
 * React Native Tour Package
 * 
 * A comprehensive tour guide component for React Native applications
 * that supports auto-scroll, theming, loops, and works with modals/components.
 * 
 * @example
 * // 1. Wrap your app with TourProvider
 * import { TourProvider } from 'react-native-tour';
 * 
 * const App = () => (
 *   <TourProvider steps={tourSteps} onNavigate={handleNavigate}>
 *     <YourApp />
 *   </TourProvider>
 * );
 * 
 * // 2. Use TourStep to wrap elements you want to highlight
 * import { TourStep, useTour } from 'react-native-tour';
 * 
 * const MyComponent = () => {
 *   const { start, stop } = useTour();
 *   
 *   return (
 *     <TourStep 
 *       id="welcome-button" 
 *       title="Welcome!" 
 *       note="Tap this button to get started"
 *       theme="light"
 *       autoDelay={3}
 *       onPress={() => console.log('Button pressed!')}
 *     >
 *       <TouchableOpacity onPress={start}>
 *         <Text>Start Tour</Text>
 *       </TouchableOpacity>
 *     </TourStep>
 *   );
 * };
 */

/**
 * TourProvider Props:
 * @param {Array} steps - Array of step definitions
 *   @example steps={[
 *     { id: 'step1', screen: 'Home', title: 'First Step' },
 *     { id: 'step2', screen: 'Details', title: 'Second Step' }
 *   ]}
 * 
 * @param {Function} onNavigate - Navigation handler for multi-screen tours
 *   @example onNavigate={(screen) => navigation.navigate(screen)}
 * 
 * @param {ReactNode} children - Your app components
 */

/**
 * TourStep Props:
 * @param {string} id - Unique identifier for this step (REQUIRED)
 *   @example id="profile-button"
 * 
 * @param {string} title - Title displayed in tooltip
 *   @example title="Profile Settings"
 * 
 * @param {string} note - Description text in tooltip
 *   @example note="Tap here to access your profile settings and preferences"
 * 
 * @param {Function} onPress - Function called when user taps the highlighted element
 *   @example onPress={() => navigation.navigate('Profile')}
 * 
 * @param {number} autoDelay - Auto advance to next step after X seconds (optional)
 *   @example autoDelay={3} // Auto advance after 3 seconds
 *   @example autoDelay={0} // Manual advance only
 * 
 * @param {string} continueText - Text for continue button in tooltip (optional)
 *   @example continueText="Next Step"
 *   @example continueText="Continue Tour"
 * 
 * @param {'light'|'dark'} theme - Tooltip appearance theme (optional)
 *   @example theme="light" // White background, dark text
 *   @example theme="dark"  // Dark background, light text
 * 
 * @param {ReactNode} children - The component to wrap and highlight (REQUIRED)
 */

/**
 * useTour Hook Returns:
 * @returns {Object} Tour control functions
 * 
 * @property {Function} start - Start the tour
 *   @example start() // Start normal tour
 *   @example start(true) // Start looping tour
 * 
 * @property {Function} next - Advance to next step manually
 *   @example next()
 * 
 * @property {Function} stop - Stop the tour completely
 *   @example stop()
 * 
 * @property {Function} setLoop - Enable/disable tour looping
 *   @example setLoop(true) // Enable infinite loop
 *   @example setLoop(false) // Disable loop
 * 
 * @property {boolean} isLooping - Current loop status
 * 
 * @property {number} loopCount - Number of completed loops
 * 
 * @property {Object} currentStep - Current active step object
 *   @example currentStep.id // Current step ID
 *   @example currentStep.title // Current step title
 * 
 * @property {boolean} isActive - Whether tour is currently running
 */

/**
 * Advanced Examples:
 * 
 * // Auto-advancing step with custom action
 * <TourStep 
 *   id="auto-step" 
 *   title="Auto Step" 
 *   note="This will advance automatically in 5 seconds"
 *   autoDelay={5}
 *   theme="dark"
 *   onPress={() => {
 *     // This still executes when user taps, even with autoDelay
 *     console.log('User tapped early!');
 *     handleEarlyAction();
 *   }}
 * >
 *   <YourComponent />
 * </TourStep>
 * 
 * // Manual step with continue button
 * <TourStep 
 *   id="manual-step" 
 *   title="Manual Step" 
 *   note="Read this carefully, then click continue below"
 *   continueText="I understand, continue"
 *   theme="light"
 * >
 *   <InformationPanel />
 * </TourStep>
 * 
 * // Step that works in modals/ActionSheets
 * <TourStep 
 *   id="modal-step" 
 *   title="Modal Content" 
 *   note="Tour works perfectly inside modals and overlays!"
 *   theme="dark"
 *   autoDelay={3}
 * >
 *   <ModalContent />
 * </TourStep>
 * 
 * // Component with multiple tour elements
 * const FeatureList = () => (
 *   <View>
 *     <TourStep id="header" title="List Header" note="This is the header">
 *       <Text>Feature List</Text>
 *     </TourStep>
 *     
 *     {features.map(feature => (
 *       <TourStep 
 *         key={feature.id}
 *         id={`feature-${feature.id}`}
 *         title={feature.name}
 *         note={`This is ${feature.name} feature`}
 *         onPress={() => selectFeature(feature)}
 *       >
 *         <FeatureItem feature={feature} />
 *       </TourStep>
 *     ))}
 *   </View>
 * );
 * 
 * // Loop tour control
 * const TourControls = () => {
 *   const { start, stop, setLoop, isLooping, loopCount } = useTour();
 *   
 *   return (
 *     <View>
 *       <Button title="Start Normal Tour" onPress={() => start()} />
 *       <Button title="Start Loop Tour" onPress={() => start(true)} />
 *       <Button title="Stop Tour" onPress={stop} />
 *       <Text>Loop Count: {loopCount}</Text>
 *       <Text>Is Looping: {isLooping ? 'Yes' : 'No'}</Text>
 *     </View>
 *   );
 * };
 */

export { TourProvider, useTour, TourContext } from './TourContext';
export { default as TourStep } from './TourStep';
