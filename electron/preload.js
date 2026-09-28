const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ait", {
  info: () => ipcRenderer.invoke("get-app-info"),
});
