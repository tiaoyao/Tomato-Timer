/**
 * main.js — Electron 主进程
 * 负责：窗口创建、系统托盘、系统通知、IPC 通信
 */

const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage } = require('electron');
const path = require('path');

// 防止多实例运行
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow;
let tray;

// ─── 创建主窗口 ───────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 460,
    frame: false,           // 无边框
    transparent: true,      // 窗口透明（实现毛玻璃）
    alwaysOnTop: true,      // 始终置顶
    resizable: false,       // 禁止调整大小
    skipTaskbar: false,     // 在任务栏显示
    hasShadow: true,        // 窗口阴影
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // 初始位置：右下角
    x: require('electron').screen.getPrimaryDisplay().workAreaSize.width - 340,
    y: require('electron').screen.getPrimaryDisplay().workAreaSize.height - 480,
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // 窗口关闭时最小化到托盘，而非退出
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// ─── 创建系统托盘 ─────────────────────────────────────────────────────────────
function createTray() {
  // 使用内嵌 Base64 图标，避免外部文件依赖
  const iconBase64 = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="9" r="6" fill="#FF6B6B"/>
      <path d="M8 3 C8 3 9 1 10 1" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <text x="8" y="12" font-size="6" text-anchor="middle" fill="white" font-family="Arial">🍅</text>
    </svg>
  `;

  // 创建一个简单的红色圆形托盘图标
  const { nativeImage } = require('electron');
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABklEQVQ4jWNgYGBgIIACAAAFAAGq1AwKAAAAAElFTkSuQmCC'
  );

  tray = new Tray(icon);
  tray.setToolTip('🍅 番茄时钟');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示番茄时钟',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // 双击托盘图标显示窗口
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// ─── IPC 通信：接收渲染进程消息 ────────────────────────────────────────────────

// 发送 Windows 系统通知
ipcMain.on('send-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title,
      body: body,
      silent: false,
    });
    notification.show();
  }
});

// 最小化到托盘
ipcMain.on('minimize-to-tray', () => {
  mainWindow.hide();
});

// 关闭窗口（退出程序）
ipcMain.on('quit-app', () => {
  app.isQuitting = true;
  app.quit();
});

// ─── App 生命周期 ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 第二个实例尝试启动时，聚焦已有窗口
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized() || !mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();
  }
});
