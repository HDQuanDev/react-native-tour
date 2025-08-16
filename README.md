# rn-tour-simple

Thư viện nhỏ gọn giúp xây dựng màn hướng dẫn tương tác cho ứng dụng React Native với hỗ trợ **nhiều bộ hướng dẫn khác nhau**. Các phần tử được tô sáng bằng mặt nạ SVG để tạo hiệu ứng mượt mà, vùng bên ngoài bị che sẽ không nhận được thao tác và cũng không thể cuộn. Người dùng chỉ bấm được vào vùng highlight và khi bấm, chỉ `onPress` của `TourStep` được gọi rồi tour tự chuyển sang bước tiếp theo.

## 🚀 Tính năng mới (v2.0)

- ✅ **Multiple Tour Guides**: Hỗ trợ nhiều bộ hướng dẫn khác nhau
- ✅ **Key-based activation**: Khởi chạy hướng dẫn bằng key
- ✅ **Tour tracking**: Theo dõi hướng dẫn đang chạy
- ✅ **Flexible reuse**: Tái sử dụng steps giữa các hướng dẫn
- ✅ **Backward compatible**: Tương thích với phiên bản cũ

## Cài đặt

Thêm gói từ GitHub và đảm bảo dự án đã có `react`, `react-native` và `react-native-svg`:

```bash
npm install react-native-svg
npm i rn-tour-simple
```

Hoặc sử dụng Yarn:

```bash
yarn add react-native-svg
yarn add rn-tour-simple
```

## 📖 Sử dụng cơ bản (v2.0)

### Định nghĩa nhiều bộ hướng dẫn (Multiple Tour Guides)

```jsx
import { TourProvider, TourStep, useTour } from 'rn-tour-simple';

// Định nghĩa nhiều bộ hướng dẫn khác nhau
const tourGuides = {
  // Hướng dẫn cơ bản cho người dùng mới
  'basic-flow': [
    {
      id: 'welcome-button', 
      screen: 'Home',
      title: "Chào mừng",
      note: "Đây là nút bắt đầu của ứng dụng",
      theme: 'light'
    },
    {
      id: 'main-menu',
      screen: 'Home', 
      title: "Menu chính",
      note: "Truy cập các tính năng chính tại đây",
      autoDelay: 2000 // Tự động chuyển sau 2 giây
    }
  ],
  
  // Hướng dẫn nâng cao cho tính năng đặc biệt
  'advanced-features': [
    {
      id: 'settings-gear',
      screen: 'Settings',
      title: "Cài đặt nâng cao", 
      note: "Tùy chỉnh ứng dụng theo ý muốn",
      theme: 'dark'
    },
    {
      id: 'export-data',
      screen: 'Settings',
      title: "Xuất dữ liệu",
      note: "Sao lưu thông tin quan trọng",
      finishText: "Tiếp theo →"
    }
  ],
  
  // Hướng dẫn nhanh cho tính năng cụ thể
  'quick-start': [
    {
      id: 'create-button',
      screen: 'Home',
      title: "Tạo mới",
      note: "Bắt đầu tạo nội dung ngay"
    }
  ]
};

// Bọc toàn bộ app với tourGuides
const App = () => (
  <TourProvider 
    tourGuides={tourGuides} 
    onNavigate={(screen) => navigation.navigate(screen)}

  >
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </TourProvider>
);
```

### Sử dụng trong Components

```jsx
const HomeScreen = () => {
  const { start, stop, currentTourKey, availableTours, isLooping } = useTour();
  
  const handleStartBasicTour = () => {
    start('basic-flow'); // Khởi chạy hướng dẫn cơ bản
  };
  
  const handleStartQuickTour = () => {
    start('quick-start', true); // Khởi chạy với chế độ lặp
  };
  
  const handleStopTour = () => {
    stop(); // Dừng hướng dẫn hiện tại
  };

  return (
    <View style={styles.container}>
      {/* Các TourStep - chỉ cần id khớp với tourGuides */}
      <TourStep id="welcome-button">
        <Button title="Chào mừng" onPress={() => {}} />
      </TourStep>
      
      <TourStep id="main-menu">
        <View style={styles.menu}>
          <Text>Menu chính</Text>
        </View>
      </TourStep>
      
      <TourStep 
        id="create-button"
        onPress={() => {
          // Custom action khi step này được bấm
          console.log('Creating new item...');
        }}
      >
        <Button title="Tạo mới" onPress={() => {}} />
      </TourStep>
      
      {/* Các nút điều khiển tour */}
      <View style={styles.tourControls}>
        <Button title="Tour cơ bản" onPress={handleStartBasicTour} />
        <Button title="Tour nhanh" onPress={handleStartQuickTour} />
        <Button 
          title="Dừng tour" 
          onPress={handleStopTour}
          disabled={!currentTourKey}
        />
      </View>
      
      {/* Hiển thị trạng thái */}
      {currentTourKey && (
        <Text>Đang chạy: {currentTourKey} {isLooping && '(Lặp)'}</Text>
      )}
      
      {/* Hiển thị tất cả tours có sẵn */}
      <Text>Tours có sẵn:</Text>
      {availableTours.map(tourKey => (
        <Button 
          key={tourKey}
          title={`Chạy ${tourKey}`}
          onPress={() => start(tourKey)}
        />
      ))}
    </View>
  );
};

const SettingsScreen = () => (
  <View>
    <TourStep id="settings-gear">
      <Button title="⚙️ Cài đặt" />
    </TourStep>
    
    <TourStep id="export-data">
      <Button title="📤 Xuất dữ liệu" />
    </TourStep>
  </View>
);
```

### Tuỳ chỉnh Setting cho Tour (Button text, màu sắc...)

Bạn có thể truyền setting tuỳ chỉnh cho từng tour khi gọi start:

```js
start('basic-flow', false, {
  skipText: 'Bỏ qua',
  continueText: 'Tiếp tục',
  themeStyles: {
    button: { backgroundColor: '#ff6600' },
    buttonText: { color: '#fff' },
    tooltip: { backgroundColor: '#222', borderColor: '#ff6600' }
    // ... các style khác nếu muốn
  }
})
```

Hoặc bạn có thể thêm thuộc tính `setting` vào step đầu tiên của mỗi tour trong tourGuides:

```js
const tourGuides = {
  'basic-flow': [
    {
      id: 'welcome-button',
      title: 'Chào mừng',
      note: 'Đây là nút bắt đầu',
      setting: {
        skipText: 'Bỏ qua',
        continueText: 'Tiếp tục',
        themeStyles: {
          button: { backgroundColor: '#ff6600' },
          buttonText: { color: '#fff' }
        }
      }
    },
    // ...
  ]
}
```

Các giá trị setting sẽ được áp dụng cho toàn bộ tour đó:
- `skipText`: Text cho nút bỏ qua
- `continueText`: Text cho nút tiếp theo
- `themeStyles`: Ghi đè màu sắc, style cho các thành phần overlay (button, tooltip, text...)

## 🔄 Migration từ v1.x

Nếu bạn đang sử dụng phiên bản cũ, có 2 cách để nâng cấp:

### Cách 1: Cập nhật trực tiếp (Khuyến nghị)

```jsx
// TRƯỚC (v1.x)
const tourSteps = [
  { id: 'step1', title: 'Bước 1' },
  { id: 'step2', title: 'Bước 2' }
];

<TourProvider steps={tourSteps}>
  <App />
</TourProvider>

const { start } = useTour();
start(); // Không có tham số

// SAU (v2.x) 
const tourGuides = {
  'main-tour': [
    { id: 'step1', title: 'Bước 1' },
    { id: 'step2', title: 'Bước 2' }
  ]
};

<TourProvider tourGuides={tourGuides}>
  <App />
</TourProvider>

const { start } = useTour();
start('main-tour'); // Cần truyền key
```

### Cách 2: Sử dụng Backward Compatible Wrapper

```jsx
// Tạo wrapper để tương thích với code cũ
export const BackwardCompatibleTourProvider = ({ 
  children, 
  steps, 
  tourGuides,
  ...otherProps 
}) => {
  const finalTourGuides = tourGuides || (steps ? { 'default': steps } : {});
  
  return (
    <TourProvider 
      tourGuides={finalTourGuides}
      {...otherProps}
    >
      {children}
    </TourProvider>
  );
};

export const useBackwardCompatibleTour = () => {
  const tourContext = useTour();
  
  return {
    ...tourContext,
    start: (loop = false) => {
      return tourContext.start('default', loop);
    }
  };
};

// Sử dụng như cũ
<BackwardCompatibleTourProvider steps={oldSteps}>
  <App />
</BackwardCompatibleTourProvider>

const { start } = useBackwardCompatibleTour();
start(); // Hoạt động như cũ
```

## 📚 API Reference

### TourProvider Props

| Prop | Type | Mặc định | Mô tả |
|------|------|----------|-------|
| `tourGuides` | `Object` | `{}` | Object chứa các bộ hướng dẫn, key là tên tour, value là mảng steps |
| `steps` | `Array` | `[]` | **(Deprecated)** Mảng steps cho tương thích v1.x |
| `onNavigate` | `Function` | `undefined` | Callback khi cần chuyển màn hình `(screen) => void` |

| `children` | `ReactNode` | - | Components con |

### Step Object

```typescript
interface Step {
  id: string;                    // ID duy nhất để khớp với TourStep
  screen?: string;               // Tên màn hình để navigate
  title?: string;                // Tiêu đề tooltip
  note?: string;                 // Nội dung mô tả
  theme?: 'light' | 'dark';      // Theme cho tooltip
  autoDelay?: number;            // Tự động chuyển sau X ms
  finishText?: string;         // Text nút tiếp tục
  onPress?: Function;            // Custom handler khi step được bấm
}
```

### TourStep Props

| Prop | Type | Mặc định | Mô tả |
|------|------|----------|-------|
| `id` | `string` | **bắt buộc** | ID khớp với step trong tourGuides |
| `title` | `string` | `undefined` | Override title từ step definition |
| `note` | `string` | `undefined` | Override note từ step definition |
| `theme` | `'light' \| 'dark'` | `undefined` | Override theme từ step definition |
| `autoDelay` | `number` | `undefined` | Override autoDelay từ step definition |
| `finishText` | `string` | `undefined` | Override finishText từ step definition |
| `onPress` | `Function` | `undefined` | Custom handler khi step được bấm |
| `children` | `ReactNode` | **bắt buộc** | Component/Element cần highlight |

### useTour Hook

```typescript
interface TourContextValue {
  // Core functions
  start: (tourKey: string, loop?: boolean) => Promise<void>;
  next: () => void;
  stop: () => void;
  
  // Registration (chỉ dùng nội bộ)
  registerStep: (stepData) => void;
  
  // State
  currentStep: Step | undefined;
  currentTourKey: string | null;
  currentIndex: number | null;
  isLooping: boolean;
  loopCount: number;
  totalSteps: number;
  availableTours: string[];
  
  // Control
  setLoop: (loop: boolean) => void;
  forceRefresh: () => void;
  forceMeasure: () => void;
}
```

## 🎯 Ví dụ thực tế

### Modal xác nhận tour

```jsx
const TourConsentModal = ({ visible, onClose }) => {
  const { start, availableTours } = useTour();
  
  const handleStartTour = (tourKey) => {
    onClose();
    setTimeout(() => {
      start(tourKey);
    }, 500);
  };
  
  return (
    <Modal visible={visible} transparent>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Chọn hướng dẫn</Text>
          
          {availableTours.map(tourKey => (
            <TouchableOpacity 
              key={tourKey}
              style={styles.tourButton}
              onPress={() => handleStartTour(tourKey)}
            >
              <Text>{tourKey}</Text>
            </TouchableOpacity>
          ))}
          
          <Button title="Bỏ qua" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};
```

### Conditional Tour