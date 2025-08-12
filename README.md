# react-native-tour

Thư viện nhỏ gọn giúp xây dựng màn hướng dẫn tương tác cho ứng dụng React Native. Các phần tử được tô sáng bằng mặt nạ SVG để tạo hiệu ứng mượt mà, vùng bên ngoài bị che sẽ không nhận được thao tác, còn người dùng vẫn có thể bấm trực tiếp vào vùng highlight để thực hiện hành động và chuyển sang bước tiếp theo.

## Cài đặt

Thêm gói từ GitHub và đảm bảo dự án đã có `react`, `react-native` và `react-native-svg`:

```bash
npm install github:fake/react-native-tour
npm install react-native-svg
```

## Sử dụng cơ bản

```jsx
import { TourProvider, TourStep, useTour } from 'react-native-tour';

// Bọc toàn bộ app để overlay luôn hiển thị phía trên mọi màn hình
const App = () => (
  <TourProvider onNavigate={(screen) => navigation.navigate(screen)}>
    <HomeScreen />
    <DetailScreen />
  </TourProvider>
);

// Đăng ký các bước trong từng màn
const HomeScreen = () => {
  const { start } = useTour();
  return (
    <View>
      <TourStep
        id="start"
        order={0}
        title="Bắt đầu"
        note="Nhấn để khởi động tour"
        screen="Home"
      >
        <Button title="Start" onPress={start} />
      </TourStep>
    </View>
  );
};

const DetailScreen = () => (
  <View>
    <TourStep
      id="details"
      order={1}
      title="Chi tiết"
      note="Nhấn để tiếp tục"
      screen="Details"
      onPress={() => {
        // xử lý riêng của bạn
      }}
    >
      <Button title="Do something" />
    </TourStep>
  </View>
);
```

Mỗi `TourStep` tự đăng ký với `TourProvider`. Khi người dùng bấm vào vùng highlight, thư viện sẽ gọi `onPress` của phần tử gốc (nếu có), chạy hàm `onPress` truyền vào `TourStep` và tự động chuyển sang bước kế tiếp. Nếu bước mới khai báo `screen`, hàm `onNavigate` được gọi để bạn chuyển màn hình trước khi highlight tiếp theo được đo đạc.

Tooltip được canh vị trí tự động: lật lên trên khi không đủ chỗ bên dưới và giới hạn trong bề rộng màn hình. Overlay chỉ biến mất khi người dùng hoàn thành bước hiện tại, vì vậy mọi thao tác bên ngoài vùng highlight đều bị chặn.

## Hướng dẫn chi tiết

1. **Bọc ứng dụng bằng `TourProvider`** và truyền `onNavigate` nếu cần chuyển màn.
2. **Đăng ký từng bước** bằng `TourStep` với `id` duy nhất và `order` tăng dần.
3. **Khởi động tour** bằng `start()` lấy từ `useTour`.
4. **Xử lý tương tác** trong `onPress` của phần tử con hoặc của chính `TourStep`. Sau khi xử lý, thư viện sẽ tự gọi bước tiếp theo.
5. **Giải thích cho người dùng** bằng `title` và `note` để Tooltip hiển thị thông tin rõ ràng.

## Mẹo

- Đặt `TourProvider` ở cấp cao nhất (thường là sau NavigationContainer) để overlay không bị ẩn khi đổi màn hình.
- Đảm bảo màn hình đích đã mount trước khi người dùng bấm tiếp; highlight chỉ xuất hiện khi `TourStep` tương ứng có mặt.
- Tùy chỉnh `react-native-svg` theo hướng dẫn của dự án để biên dịch chính xác trên iOS và Android.

