const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    center: true,
    width: 460,
    height: 680,
    minWidth: 420,
    minHeight: 450,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
    // transparent: true,
    frame: false,
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  win.webContents.openDevTools();
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


