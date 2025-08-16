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
 * @param {string} finishText - Text for continue button in tooltip (optional)
 *   @example finishText="Next Step"
 *   @example finishText="Continue Tour"
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

export { TourProvider, useTour, TourContext } from './TourContext';
export { default as TourStep } from './TourStep';
        