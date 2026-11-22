'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('picker', {
  onSources: (cb) => ipcRenderer.on('picker:sources', (e, s) => cb(s)),
  choose: (id) => ipcRenderer.send('picker:choose', id),
});
