# sybauargon — ứng dụng máy tính (Electron)

App chỉ là một "vỏ" mở web https://sybauargon.site.je/ (đổi địa chỉ trong `config.json`).
Web cập nhật thì app tự dùng bản mới, không cần build lại.

## Có gì trong app
- Chạy nền ở khay hệ thống: bấm X chỉ thu nhỏ xuống khay; chuột phải icon khay → "Thoát hẳn".
- Thông báo kiểu Windows khi có tin mới (bấm vào thông báo là mở đúng cuộc trò chuyện).
- Số tin chưa đọc hiện trên icon thanh tác vụ, icon nhấp nháy khi có tin mới lúc bạn không ở trong app.
- Tuỳ chọn "Khởi động cùng máy tính" (chuột phải icon khay) — app chạy ẩn dưới khay.
- Chỉ mở được một cửa sổ; nhớ vị trí/kích thước cửa sổ.
- Chia sẻ màn hình có hộp chọn màn hình/cửa sổ.
- Mất mạng thì hiện trang chờ và tự thử lại.

## Cách 1 — Build bằng GitHub (không cần cài gì)
1. Vào https://github.com, tạo tài khoản (miễn phí) rồi bấm **New repository**, đặt tên `sybauargon-desktop`, chọn **Private**, bấm **Create**.
2. Bấm **uploading an existing file** và kéo thả TẤT CẢ file/thư mục trong thư mục này (trừ `.github`) vào, bấm **Commit changes**.
3. Tạo file workflow: **Add file → Create new file**, ở ô tên gõ đúng `.github/workflows/build.yml`, dán nội dung file `.github/workflows/build.yml` (có trong zip) vào, bấm **Commit**.
4. Vào tab **Actions** → **Build app** → **Run workflow**. Đợi 3–6 phút.
5. Mở lần chạy vừa xong, kéo xuống mục **Artifacts**, tải `sybauargon-windows-latest` → giải nén được file `sybauargon Setup 1.0.0.exe`. Chạy file đó để cài.

Windows có thể hiện cảnh báo "Windows protected your PC" vì app chưa có chữ ký số: bấm **More info → Run anyway**.

## Cách 2 — Build trên máy bạn
1. Cài Node.js bản LTS từ https://nodejs.org
2. Mở terminal trong thư mục này:
   ```
   npm install
   npm start          # chạy thử
   npm run dist:win   # tạo file cài đặt trong thư mục dist/
   ```

## Cập nhật vỏ app
Chỉ cần khi đổi icon/tên/tính năng của vỏ: sửa file rồi build lại (đổi `version` trong `package.json`).
