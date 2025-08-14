# react-native-tour

Thư viện nhỏ gọn giúp xây dựng màn hướng dẫn tương tác cho ứng dụng React Native. Các phần tử được tô sáng bằng mặt nạ SVG để tạo hiệu ứng mượt mà, vùng bên ngoài bị che sẽ không nhận được thao tác và cũng không thể cuộn. Người dùng chỉ bấm được vào vùng highlight và khi bấm, chỉ `onPress` của `TourStep` được gọi rồi tour tự chuyển sang bước tiếp theo. `onPress` của phần tử con chỉ hoạt động khi tour không chạy.

## Cài đặt

Thêm gói từ GitHub và đảm bảo dự án đã có `react`, `react-native` và `react-native-svg`:

```bash
npm install github:fake/react-native-tour
npm install react-native-svg
```

## Sử dụng cơ bản

### Cách 1: Định nghĩa steps tập trung (Khuyến nghị)

```jsx
import { TourProvider, TourStep, useTour } from 'react-native-tour';

// Định nghĩa tất cả steps và cấu hình tại một nơi
const tourSteps = [
  {
    id: 'collection-tab', 
    screen: 'Home',
    title: "Ngũ cảnh",
    note: "Ấn vào đây để xem, chạy và sửa các danh sách ngữ cảnh",
    theme: 'dark'
  },
  {
    id: 'search-button',
    screen: 'Search', 
    title: "Tìm kiếm",
    note: "Sử dụng để tìm kiếm nội dung",
    autoDelay: 3 // Tự động chuyển sau 3 giây
  },
  {
    id: 'details',
    screen: 'Details',
    title: "Chi tiết", 
    note: "Nhấn để tiếp tục"
  }
];

// Bọc toàn bộ app
const App = () => (
  <TourProvider steps={tourSteps} onNavigate={(s) => navigation.navigate(s)}>
    <HomeScreen />
    <SearchScreen />
    <DetailScreen />
  </TourProvider>
);

// Chỉ cần wrap elements cần highlight, không cần định nghĩa title/note nữa
const HomeScreen = () => {
  const { start } = useTour();
  return (
    <View>
      <TourStep id="collection-tab">
        <Button title="Collection" onPress={() => {}} />
      </TourStep>
      
      <Button title="Start Tour" onPress={() => start()} />
    </View>
  );
};

const SearchScreen = () => (
  <View>
    <TourStep id="search-button">
      <Button title="Search" />
    </TourStep>
  </View>
);

const DetailScreen = () => (
  <View>
    <TourStep 
      id="details"
      onPress={() => {
        // Có thể override hành động tại đây
        console.log('Custom action');
      }}
    >
      <Button title="Do something" />
    </TourStep>
  </View>
);
```

### Cách 2: Định nghĩa steps phân tán (Cách cũ)

```jsx
import { TourProvider, TourStep, useTour } from 'react-native-tour';

// Chỉ khai báo thứ tự và màn hình
const steps = [
  { id: 'start', screen: 'Home' },
  { id: 'details', screen: 'Details' },
];

// Bọc toàn bộ app để overlay luôn hiển thị phía trên mọi màn hình
const App = () => (
  <TourProvider steps={steps} onNavigate={(s) => navigation.navigate(s)}>
    <HomeScreen />
    <DetailScreen />
  </TourProvider>
);

// Đăng ký phần tử cần highlight trong từng màn
const HomeScreen = () => {
  const { start } = useTour();
  return (
    <View>
      <TourStep id="start" title="Bắt đầu" note="Nhấn để khởi động tour">
        <Button title="Start" onPress={start} />
      </TourStep>
    </View>
  );
};

const DetailScreen = () => (
  <View>
    <TourStep
      id="details"
      title="Chi tiết"
      note="Nhấn để tiếp tục"
      onPress={() => {
        // xử lý riêng của bạn
      }}
    >
      <Button title="Do something" />
    </TourStep>
  </View>
);
```

`TourProvider` nhận mảng `steps` để biết thứ tự và màn hình của từng bước. Mỗi `TourStep` chỉ cần cung cấp `id` và nội dung; khi người dùng bấm vào vùng highlight, hàm `onPress` của `TourStep` (nếu có) được chạy rồi tour tự chuyển sang bước tiếp theo. `onPress` của phần tử con chỉ được gọi khi bước đó không được highlight. Nếu bước mới chỉ định `screen`, `onNavigate` sẽ được gọi để bạn điều hướng trước khi highlight tiếp theo được đo đạc.

Tooltip được canh vị trí tự động: lật lên trên khi không đủ chỗ bên dưới và giới hạn trong bề rộng màn hình. Overlay chỉ biến mất khi người dùng hoàn thành bước hiện tại, vì vậy mọi thao tác bên ngoài vùng highlight đều bị chặn.

## Hướng dẫn chi tiết

1. **Bọc ứng dụng bằng `TourProvider`** cùng mảng `steps` và truyền `onNavigate` nếu cần chuyển màn.
2. **Đăng ký từng bước** bằng `TourStep` với `id` trùng khớp và `title`, `note` để tooltip hiển thị.
3. **Khởi động tour** bằng `start()` lấy từ `useTour`.
4. **Xử lý tương tác** trong `onPress` của `TourStep`. Sau khi chạy hàm này, thư viện tự chuyển sang bước tiếp theo.
5. **Tooltip** tự căn vị trí để không che nội dung và luôn nằm trong màn hình.

## Xử lý vấn đề Animation/Layout

Nếu ứng dụng có nhiều animation hoặc hiệu ứng, tour có thể bị "đơ" do layout chưa ổn định. Package đã tự động kiểm tra và retry, nhưng bạn có thể force refresh nếu cần:

```jsx
const MyScreen = () => {
  const { start, forceMeasure, forceRefresh } = useTour();
  
  const handleStartTour = () => {
    // Nếu tour bị đơ, thử force refresh trước
    forceRefresh();
    
    // Hoặc force đo lại layout
    setTimeout(() => {
      forceMeasure();
    }, 100);
    
    start();
  };
  
  return (
    <Button title="Start Tour" onPress={handleStartTour} />
  );
};
```

## Mẹo

- Đặt `TourProvider` ở cấp cao nhất (thường là sau `NavigationContainer`) để overlay không bị ẩn khi đổi màn.
- Khi bước tiếp theo ở màn khác, `onNavigate` sẽ được gọi trước rồi highlight mới xuất hiện sau khi `TourStep` được mount.
- Tùy chỉnh `react-native-svg` theo hướng dẫn của dự án để biên dịch chính xác trên iOS và Android.

