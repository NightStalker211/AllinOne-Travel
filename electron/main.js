// ============================================================
// AllinOne Travel — Electron main process (fresh, lean)
// Serves the static export (./out) over a local HTTP server so
// asset paths resolve exactly as they would on the web.
// ============================================================

const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const http = require("http");
const serveHandler = require("serve-handler");

const APP_NAME = "AllinOne Travel";
const APP_VERSION = require(path.join(__dirname, "..", "package.json")).version;

const forceProd =
  process.env.ALLINONE_FORCE_PROD === "1" ||
  process.argv.includes("--force-prod");
const isDev = !app.isPackaged && !forceProd;

const OUT_DIR = path.join(__dirname, "..", "out");
const DEV_URL = "http://localhost:3000";

let mainWindow = null;
let localServer = null;
let serverUrl = "";

// ---------- static export server ----------

function startStaticServer() {
  return new Promise((resolve, reject) => {
    localServer = http.createServer((req, res) =>
      serveHandler(req, res, {
        public: OUT_DIR,
        directoryListing: false,
        // Next static export ships real HTML per route; cleanUrls maps
        // /search -> /search.html. No SPA catch-all rewrite (it would
        // clobber every route to index.html).
        cleanUrls: true,
        headers: [
          {
            source: "/_next/**",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
        ],
      })
    );
    localServer.on("error", reject);
    localServer.listen(0, "127.0.0.1", () => {
      serverUrl = `http://127.0.0.1:${localServer.address().port}`;
      console.log(`[${APP_NAME}] serving ${OUT_DIR} on ${serverUrl}`);
      resolve(serverUrl);
    });
  });
}

function stopStaticServer() {
  if (localServer) {
    localServer.close();
    localServer = null;
  }
}

// ---------- window ----------

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: "#0b0f17",
    title: APP_NAME,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(DEV_URL);
  } else {
    await startStaticServer();
    mainWindow.loadURL(serverUrl);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // External links always open in the system browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isDev && url.startsWith(DEV_URL)) return;
    if (serverUrl && url.startsWith(serverUrl)) return;
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ---------- menu / ipc ----------

function createMenu() {
  const template = [
    ...(process.platform === "darwin"
      ? [{ label: APP_NAME, submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }] }]
      : []),
    {
      label: "File",
      submenu: [
        { role: "reload", label: "Reload" },
        { type: "separator" },
        process.platform === "darwin" ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function setupIpc() {
  ipcMain.handle("get-app-info", () => ({
    name: APP_NAME,
    version: APP_VERSION,
    platform: process.platform,
    isDev,
  }));
}

// ---------- lifecycle ----------

app.whenReady().then(async () => {
  setupIpc();
  await createWindow();
  createMenu();

  app.on("activate", async () => {
    if (mainWindow) mainWindow.show();
    else await createWindow();
  });
});

app.on("window-all-closed", () => {
  stopStaticServer();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", stopStaticServer);

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

console.log(
  `[${APP_NAME}] v${APP_VERSION} starting (${isDev ? "dev" : "production"})`
);
