'use strict';
const { contextBridge, ipcRenderer } = require('electron');
// Web nhận biết đang chạy trong app máy tính qua window.isDesktopApp / window.desktop
contextBridge.exposeInMainWorld('isDesktopApp', true);
contextBridge.exposeInMainWorld('desktop', { show: () => ipcRenderer.send('app:show') });
