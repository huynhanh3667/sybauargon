'use strict';
const { app, BrowserWindow, Tray, Menu, nativeImage, shell, session, desktopCapturer, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const ORIGIN = new URL(CFG.url).origin;

app.setAppUserModelId('site.je.sybauargon'); // cần cho thông báo Windows
if (!app.requestSingleInstanceLock()) { app.quit(); }

let win = null, tray = null, quitting = false, lastUnread = 0;
const stateFile = path.join(app.getPath('userData'), 'window.json');
const loadState = () => { try { return JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (e) { return {}; } };
const saveState = () => { try { if (win && !win.isMinimized() && !win.isMaximized()) fs.writeFileSync(stateFile, JSON.stringify({ bounds: win.getBounds(), max: win.isMaximized() })); } catch (e) { /* bỏ qua */ } };
const img = (f) => nativeImage.createFromPath(path.join(__dirname, 'assets', f));

function showWin() { if (!win) return createWin(); if (win.isMinimized()) win.restore(); win.show(); win.focus(); }

function createWin() {
  const st = loadState();
  win = new BrowserWindow(Object.assign({ width: 1200, height: 800, minWidth: 420, minHeight: 560, backgroundColor: '#17181d', title: CFG.name, show: false, autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, autoplayPolicy: 'no-user-gesture-required', backgroundThrottling: false, spellcheck: false } }, st.bounds || {}));
  win.removeMenu();
  if (st.max) win.maximize();
  win.once('ready-to-show', () => win.show());
  win.loadURL(CFG.url);

  // Mất mạng / host sập: hiện trang chờ rồi tự thử lại
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => {
    if (!isMain || code === -3) return;
    win.loadFile(path.join(__dirname, 'offline.html'), { query: { url: CFG.url } });
  });
  // Link ngoài mở bằng trình duyệt; trong web mình (vd. whatnew, download) cũng mở ngoài cho gọn
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(ORIGIN) && !url.startsWith('file://')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });

  // Số tin chưa đọc lấy từ tiêu đề trang: "(3) sybauargon"
  win.webContents.on('page-title-updated', (e, title) => {
    const m = title.match(/^\((\d+)\)/); setUnread(m ? parseInt(m[1], 10) : 0);
  });
  win.on('focus', () => { win.flashFrame(false); });
  win.on('close', (e) => { if (!quitting) { e.preventDefault(); win.hide(); saveState(); } else saveState(); });
  win.on('resize', saveState); win.on('move', saveState);
}

function setUnread(n) {
  if (n > lastUnread && win && !win.isFocused()) win.flashFrame(true); // nhấp nháy icon thanh tác vụ
  lastUnread = n;
  if (process.platform === 'win32' && win) win.setOverlayIcon(n ? img(`badge-${n > 9 ? '9plus' : n}.png`) : null, n ? `${n} tin chưa đọc` : '');
  if (process.platform === 'darwin' || process.platform === 'linux') app.setBadgeCount(n);
  if (tray) tray.setToolTip(n ? `${CFG.name} — ${n} tin chưa đọc` : CFG.name);
}

function buildTray() {
  tray = new Tray(img('tray.png').resize({ width: 20, height: 20 }));
  const menu = () => Menu.buildFromTemplate([
    { label: 'Mở ' + CFG.name, click: showWin },
    { type: 'separator' },
    { label: 'Khởi động cùng máy tính', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin,
      click: (it) => app.setLoginItemSettings({ openAtLogin: it.checked, args: ['--hidden'] }) },
    { label: 'Tải lại', click: () => { showWin(); win.webContents.reloadIgnoringCache(); } },
    { type: 'separator' },
    { label: 'Thoát hẳn', click: () => { quitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu());
  tray.on('click', showWin);
  tray.on('right-click', () => tray.setContextMenu(menu()));
}

// Quyền: thông báo, micro/camera, chia sẻ màn hình
function setupPermissions() {
  const ses = session.defaultSession;
  const ok = new Set(['notifications', 'media', 'display-capture', 'fullscreen', 'clipboard-sanitized-write', 'clipboard-read', 'audioCapture', 'videoCapture']);
  ses.setPermissionRequestHandler((wc, perm, cb, details) => cb(ok.has(perm) && (details.requestingUrl || '').startsWith(ORIGIN)));
  ses.setPermissionCheckHandler((wc, perm, origin) => ok.has(perm) && (origin || '').startsWith(ORIGIN));
  // Chia sẻ màn hình: hiện hộp chọn màn hình/cửa sổ
  ses.setDisplayMediaRequestHandler(async (request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 320, height: 200 } });
      if (!sources.length) return callback({});
      const chosen = await pickSource(sources);
      if (!chosen) return callback({});
      callback({ video: chosen, audio: process.platform === 'win32' ? 'loopback' : undefined });
    } catch (e) { callback({}); }
  });
}
function pickSource(sources) {
  return new Promise((resolve) => {
    const pw = new BrowserWindow({ width: 760, height: 520, parent: win, modal: true, title: 'Chọn nội dung để chia sẻ', autoHideMenuBar: true, backgroundColor: '#1d1e25',
      webPreferences: { preload: path.join(__dirname, 'picker-preload.js'), contextIsolation: true, sandbox: true } });
    pw.removeMenu();
    let done = false;
    const finish = (id) => { if (done) return; done = true; ipcMain.removeAllListeners('picker:choose'); resolve(sources.find((s) => s.id === id) || null); if (!pw.isDestroyed()) pw.close(); };
    ipcMain.once('picker:choose', (e, id) => finish(id));
    pw.on('closed', () => finish(null));
    pw.loadFile(path.join(__dirname, 'picker.html'));
    pw.webContents.once('did-finish-load', () => pw.webContents.send('picker:sources', sources.map((s) => ({ id: s.id, name: s.name, thumb: s.thumbnail.toDataURL() }))));
  });
}

ipcMain.on('app:show', showWin);
app.on('second-instance', showWin);
app.whenReady().then(() => {
  setupPermissions(); buildTray();
  createWin();
  if (process.argv.includes('--hidden')) { win.once('ready-to-show', () => win.hide()); } // mở cùng máy: chạy ẩn dưới khay
  app.on('activate', showWin);
});
app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => { /* giữ app chạy dưới khay */ });
