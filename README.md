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
import { TourProvider, TourStep, useTour, type TourStepConfig } from 'react-native-tour';

// Describe the tour order and texts
const steps: TourStepConfig[] = [
  { id: 'start', order: 0, text: 'Tap to begin', screen: 'Home' },
  { id: 'details', order: 1, text: 'Here are more details', screen: 'Details' },
];

// Wrap your app so the overlay stays above all screens
const App = () => (
  <TourProvider steps={steps} onNavigate={(screen) => navigation.navigate(screen)}>
    <HomeScreen />
    <DetailsScreen />
  </TourProvider>
);

// Register refs in each screen
const HomeScreen = () => {
  const { start } = useTour();
  return (
    <View>
      <TourStep id="start">
        <Button title="Start" onPress={start} />
      </TourStep>
    </View>
  );
};

const DetailsScreen = () => (
  <View>
    <TourStep id="details">
      <Text>Details screen content</Text>
    </TourStep>
  </View>
);
```

The provider receives an ordered `steps` array describing each tooltip and the
screen it appears on. A `TourStep` only needs an `id`; it registers its ref when
mounted so the provider can measure it. When advancing to a step with a
different `screen`, `onNavigate` is invoked, allowing easy integration with
libraries like React Navigation. The overlay remains visible across screens, and
users advance the tour by tapping the highlighted area.

## Tips

- Ensure the `id` passed to each `TourStep` matches an entry in the `steps`
  array.
- Place `TourProvider` at the root of your app so it can render above different
  screens.
- The next step won't highlight until the target screen's `TourStep` has
  mounted, so make sure navigation completes before users tap again.
