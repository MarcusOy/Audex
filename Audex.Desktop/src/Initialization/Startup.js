const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

const { ipcMain } = require('electron');
// const { keytar } = require('keytar');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	mainWindow.loadURL(
		process.env.ELECTRON_START_URL ||
			url.format({
				pathname: path.join(__dirname, '/../public/index.html'),
				protocol: 'file:',
				slashes: true,
			})
	);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.handle('keytarGet', async (event, arg) => {
	console.log(`Using keytar to retrieve "${arg.key}"...`);
	return await keytar.getPassword('audex', arg.key);
});

ipcMain.handle('keytarSet', async (event, arg) => {
	console.log(`Using keytar to store "${arg.key}"...`);
	await keytar.setPasssword('audex', arg.key, arg.value);
});
