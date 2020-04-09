const { remote } = require('electron');

document.getElementById('mini_btn').addEventListener('click', () => {
  remote.getCurrentWindow().minimize();
});

document.getElementById('close_btn').addEventListener('click', () => {
  remote.app.quit();
});
