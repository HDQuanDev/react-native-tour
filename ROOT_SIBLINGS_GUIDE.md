# React Native Tour with Root Siblings Integration

Tích hợp `react-native-root-siblings` để xử lý các trường hợp cần tour và overlay lên trên modal hoặc RBSheet.

## Cài đặt

```bash
npm install react-native-root-siblings
# hoặc
yarn add react-native-root-siblings
```

## Sử dụng

### 1. Tour với Root Siblings trong TourProvider

```jsx
import { TourProvider } from 'rn-tour-simple';

const App = () => (
  <TourProvider 
    steps={tourSteps} 
    onNavigate={handleNavigate}
    useRootSiblings={true}  // Bật chế độ root siblings
  >
    <YourApp />
  </TourProvider>
);
```

### 2. Sử dụng useTourRoot Hook

```jsx
import { useTourRoot } from 'rn-tour-simple';

const ModalWithTour = () => {
  const { showTour, hideTour } = useTourRoot();
  const buttonRef = useRef();
  
  const handleShowTour = () => {
    const step = {
      id: 'modal-button',
      title: 'Nút trong Modal',
      note: 'Đây là tour hiển thị trên modal!',
      continueText: 'Hiểu rồi',
      theme: 'dark'
    };
    
    showTour(step, buttonRef, () => {
      console.log('Hoàn thành tour trong modal');
      hideTour();
    });
  };
  
  return (
    <Modal visible={modalVisible}>
      <TouchableOpacity ref={buttonRef} onPress={handleShowTour}>
        <Text>Hiển thị Tour trong Modal</Text>
      </TouchableOpacity>
    </Modal>
  );
};
```

### 3. Tour với RBSheet

```jsx
import { useTourRoot } from 'rn-tour-simple';
import RBSheet from 'react-native-raw-bottom-sheet';

const RBSheetWithTour = () => {
  const { showTour, hideTour } = useTourRoot();
  const actionRef = useRef();
  const rbSheetRef = useRef();
  
  const showModalTour = () => {
    rbSheetRef.current.open();
    
    // Đợi RBSheet mở xong
    setTimeout(() => {
      const step = {
        id: 'rbsheet-action',
        title: 'Hành động Bottom Sheet',
        note: 'Tour hiển thị trên RBSheet!',
        autoDelay: 5,
        theme: 'light'
      };
      
      showTour(step, actionRef, () => {
        hideTour();
        rbSheetRef.current.close();
      });
    }, 300);
  };
  
  return (
    <>
      <TouchableOpacity onPress={showModalTour}>
        <Text>Mở RBSheet với Tour</Text>
      </TouchableOpacity>
      
      <RBSheet ref={rbSheetRef}>
        <TouchableOpacity ref={actionRef}>
          <Text>Hành động trong Bottom Sheet</Text>
        </TouchableOpacity>
      </RBSheet>
    </>
  );
};
```

## API Reference

### useTourRoot Hook

```jsx
const { showTour, updateTour, hideTour } = useTourRoot();
```

#### Methods

- **showTour(step, targetRef, onStepPress, loopCount)**: Hiển thị tour overlay
- **updateTour(step, targetRef, onStepPress, loopCount)**: Cập nhật tour overlay
- **hideTour()**: Ẩn tour overlay

#### Parameters

- **step**: Object chứa thông tin step
  ```jsx
  {
    id: 'unique-id',
    title: 'Tiêu đề',
    note: 'Mô tả',
    continueText: 'Tiếp tục', // optional
    autoDelay: 3, // optional, tự động chuyển sau 3 giây
    theme: 'light' | 'dark' // optional
  }
  ```
- **targetRef**: Ref của element cần highlight
- **onStepPress**: Function được gọi khi user tap vào step
- **loopCount**: Số lần lặp (optional)

### TourProvider Props Mới

```jsx
<TourProvider
  steps={steps}
  onNavigate={onNavigate}
  useRootSiblings={true} // Bật chế độ root siblings
>
```

## Ưu điểm của Root Siblings

1. **Hiển thị trên Modal**: Tour overlay có thể hiển thị trên các modal, bottom sheet
2. **Z-index cao nhất**: Đảm bảo tour luôn hiển thị trên cùng
3. **Không bị chặn**: Không bị các component khác che khuất
4. **Linh hoạt**: Có thể sử dụng độc lập hoặc kết hợp với TourProvider

## Lưu ý

- Cần cài đặt `react-native-root-siblings` làm dependency
- Khi sử dụng `useRootSiblings={true}`, TourOverlay sẽ không render trong component tree thông thường
- Thích hợp cho các trường hợp tour cần hiển thị trên modal, bottom sheet, hoặc overlay khác
