<div align="center">

# sybauargon

**Ứng dụng nhắn tin tự host, giao diện kiểu Discord. Chạy bằng PHP + MySQL, có app Windows.**

[🌐 Dùng thử bản web](https://sybauargon.site.je/) ·
[⬇ Tải app Windows](https://github.com/huynhanh3667/sybauargon/releases/latest/download/sybauargon-setup.exe) ·
[✨ Có gì mới](https://sybauargon.site.je/whatnew) ·
[📦 Tất cả bản phát hành](https://github.com/huynhanh3667/sybauargon/releases)

</div>

---

## Giới thiệu

**sybauargon** là một web nhắn tin tự viết, dành cho nhóm bạn bè. Mã nguồn gọn: một file API PHP, giao diện JavaScript thuần (không framework), chạy được trên hosting miễn phí như InfinityFree. Có bản web dùng ngay trên trình duyệt, và bản app cho máy tính Windows với thông báo giống Discord.

## Tính năng

### Nhắn tin
- Chat 1-1 và nhóm: đổi tên, chủ đề, màu, mời / đuổi thành viên, chuyển chủ nhóm, rời nhóm
- Trả lời, **sửa tin**, **ghim tin**, **chuyển tiếp**, xóa trong 24 giờ, thả emoji
- Chỉ báo **đang nhập…**, `@mention` và `@everyone` trong nhóm
- **Tìm trong cuộc trò chuyện**, kho ảnh / file / link, nhảy tới tin cũ
- Tự lưu bản nháp theo từng cuộc trò chuyện, nút xuống cuối kèm số tin mới
- Gửi ảnh, file, **GIF (qua Giphy)**
- Chặn người dùng

### Định dạng và nội dung
- Markdown cơ bản: in đậm, in nghiêng, mã, trích dẫn
- Tiêu đề bằng `#`, `##`, `###` và `-#` (chữ nhỏ)
- Dán link ảnh hoặc GIF để tự hiện ảnh trong tin nhắn
- Xem trước link kiểu **Open Graph** (tiêu đề, mô tả, ảnh) có bảo vệ chống SSRF

### Cuộc gọi
- Gọi thoại / video nhiều người (WebRTC), chia sẻ màn hình
- Vòng sáng người đang nói, giơ tay, thả cảm xúc, thu nhỏ cửa sổ gọi
- Chọn thiết bị âm thanh, chỉnh âm lượng từng người, thanh chất lượng kết nối

### Cá nhân hóa
- **Hồ sơ** kiểu Discord: avatar, banner, giới thiệu, bấm vào avatar để xem thẻ hồ sơ
- Chấm xanh khi online, avatar xám khi offline
- **Hình nền riêng cho từng cuộc trò chuyện** (màu, mẫu có sẵn hoặc ảnh tự tải lên)
- **Giao diện riêng cho từng tài khoản** (chủ đề, màu nhấn, cỡ chữ, kiểu bong bóng, gọn / rộng…), đổi tài khoản là đổi giao diện theo
- Hai ngôn ngữ: Tiếng Việt (mặc định) và English

### Quản trị
- Trang `admin.html` riêng: xem, đổi tên, khóa / xóa tài khoản và quản lý nhiều thứ khác
- Đăng nhập admin có giới hạn số lần thử sai

## Ứng dụng Windows

App dựng bằng [Electron](https://www.electronjs.org/), bao quanh bản web.

| | |
|---|---|
| Chạy nền | Thu nhỏ xuống khay hệ thống, đóng cửa sổ vẫn nhận tin |
| Thông báo | Thông báo native của Windows, bấm vào để mở đúng cuộc trò chuyện |
| Số tin chưa đọc | Hiện trên icon thanh tác vụ, nhấp nháy khi có tin |
| Chia sẻ màn hình | Có hộp chọn màn hình / cửa sổ |
| Một cửa sổ | Mở lần hai sẽ đưa cửa sổ cũ lên trước |
| Tự cập nhật | **Có.** App tải thẳng trang web, nên web cập nhật thì app theo |

**Tải về:** [sybauargon-setup.exe](https://github.com/huynhanh3667/sybauargon/releases/latest/download/sybauargon-setup.exe)

> App chưa được ký số, nên lần đầu cài Windows có thể hiện cảnh báo SmartScreen. Bấm **Thông tin thêm → Vẫn chạy**.

## Công nghệ

| Phần | Công nghệ |
|---|---|
| Backend | PHP (một file API JSON), PDO, MySQL |
| Frontend | HTML, CSS, JavaScript thuần |
| Thời gian thực | Polling thích ứng (nhanh khi đang dùng, chậm khi ẩn tab) |
| Cuộc gọi | WebRTC mesh, tín hiệu qua cơ sở dữ liệu |
| Ứng dụng máy tính | Electron, electron-builder (NSIS) |

## Tự cài đặt trên hosting của bạn

Cần hosting hỗ trợ **PHP 7.4+** và **MySQL**.

1. Tạo cơ sở dữ liệu MySQL và lấy thông tin kết nối.
2. Upload toàn bộ thư mục web lên hosting.
3. Mở `install.php` trên trình duyệt, điền thông tin cơ sở dữ liệu để tạo `config.php`.
4. Đăng ký tài khoản đầu tiên, rồi **xóa `install.php`, `check.php` và `upgrade.php`** khỏi hosting.
5. (Tùy chọn) Thêm khóa Giphy vào `config.php` để dùng GIF.
6. Đổi mật khẩu trang admin trong `config.php` (khóa `admin_pass`).

Khi nâng cấp bản mới: upload đè các file, **giữ nguyên `config.php`** và thư mục `uploads/`.

## Tự build app Windows

Cần [Node.js LTS](https://nodejs.org/) (bản 20 hoặc 22, không dùng bản quá mới).

```bash
cd desktop
npm install
npm start          # chạy thử
npm run dist:win   # build ra dist/sybauargon-setup.exe
```

Địa chỉ web mà app mở nằm trong `desktop/config.json`. Nếu build báo lỗi *Cannot create symbolic link*, hãy bật **Developer Mode** của Windows hoặc chạy terminal bằng quyền Administrator.

## Cấu trúc dự án

```
sybauargon/
├─ api.php            API backend (một file)
├─ index.html         Giao diện chính
├─ app.js, md.js,     Logic giao diện, Markdown, cuộc gọi, đa ngôn ngữ
│  call.js, i18n.js
├─ style.css
├─ admin.html         Trang quản trị
├─ download.html      Trang tải app
├─ whatnew.html       Nhật ký cập nhật
├─ schema.sql         Cấu trúc cơ sở dữ liệu
└─ desktop/           Mã nguồn app Windows (Electron)
```

## Lộ trình

- [x] Bản web đầy đủ, hồ sơ, hình nền, đa ngôn ngữ
- [x] Trang quản trị
- [x] App Windows
- [ ] Hệ thống bot
- [ ] Thông báo đẩy và app điện thoại
- [ ] Ký số và tự cập nhật phần vỏ app
- [ ] Bản macOS / Linux

## Bảo mật

- Không bao giờ đưa `config.php` (chứa mật khẩu cơ sở dữ liệu, khóa API) lên GitHub.
- Nếu phát hiện lỗi bảo mật, vui lòng báo riêng cho chủ dự án thay vì đăng công khai.

## Giấy phép

Dự án cá nhân, chưa công bố giấy phép mã nguồn mở. Mọi quyền được bảo lưu.
