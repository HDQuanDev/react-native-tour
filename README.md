# react-native-tour

A lightweight helper to build interactive user guides in React Native apps. Written in
plain JavaScript, it highlights elements using an SVG mask for smooth animations. Taps on the
highlighted element pass through to your UI, while presses outside the cutout move to the next step.
Steps can optionally declare a `screen` so the tour may navigate between screens while keeping the
overlay visible.

## Installation

Install directly from GitHub. React and React Native are peer dependencies and
must already exist in your project. You also need `react-native-svg` for the
masked highlight:

```bash
npm install github:fake/react-native-tour
npm install react-native-svg
```

## Basic usage

```jsx
import { TourProvider, TourStep, useTour } from 'react-native-tour';

// Wrap your app so the overlay stays above all screens
const App = () => (
  <TourProvider onNavigate={(screen) => navigation.navigate(screen)}>
    <HomeScreen />
    <DetailsScreen />
  </TourProvider>
);

// Register steps in each screen
const HomeScreen = () => {
  const { start } = useTour();
  return (
    <View>
      <TourStep
        id="start"
        order={0}
        title="Tap to begin"
        note="Let's get started"
        screen="Home"
        onPress={start}
      >
        <Button title="Start" />
      </TourStep>
    </View>
  );
};

const DetailsScreen = () => (
  <View>
    <TourStep
      id="details"
      order={1}
      title="Here are more details"
      note="Press to continue"
      screen="Details"
      onPress={() => {
        // handle button action
      }}
    >
      <Button title="Do something" />
    </TourStep>
  </View>
);
```

Each `TourStep` registers itself with the provider. When the wrapped element is
pressed, the optional `onPress` runs and the tour automatically advances to the
next step. Presses outside the highlight also move the tour forward. Steps are
sorted by their `order`, and whenever the active step declares a `screen`,
`onNavigate` is called so the overlay can follow navigation.

## Tips

- Give every `TourStep` a unique `id` and `order`.
- Place `TourProvider` at the root of your app so it can render above different
  screens.
- The next step won't highlight until the target screen's `TourStep` has
  mounted, so ensure navigation completes before users tap again.
