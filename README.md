# react-native-tour

A lightweight helper to build interactive user guides in React Native apps. It
highlights elements using an SVG mask for smooth animations and advances when
the user taps the highlight. Steps can optionally declare a `screen` so the tour
may navigate between screens while keeping the overlay visible.

## Installation

Install directly from GitHub and make sure `react-native-svg` is available in
your project:

```bash
npm install github:fake/react-native-tour
npm install react-native-svg
```

## Basic usage

```tsx
import { TourProvider, TourStep, useTour } from 'react-native-tour';

// Wrap your app
const App = () => (
  <TourProvider onNavigate={(screen) => navigation.navigate(screen)}>
    <HomeScreen />
  </TourProvider>
);

// Register steps
const HomeScreen = () => {
  const { start } = useTour();

  return (
    <View>
      <TourStep id="welcome" order={0} text="Tap to start" screen="Home">
        <Button title="Start" onPress={start} />
      </TourStep>
      {/* ... other content ... */}
    </View>
  );
};
```

Each `TourStep` registers itself with the provider. Calling `start` will show the
overlay and highlight the first step. When a step defines a `screen`, the
provider calls `onNavigate` before showing that step so you can integrate with
your navigation library. The overlay uses an SVG mask so only the element is
exposed, and the tooltip automatically repositions to stay on screen.

## Tips

- Ensure all `TourStep` components are mounted before calling `start` so each
  element can be measured correctly.
- Place `TourProvider` at the root of your app so it can render above different
  screens.
