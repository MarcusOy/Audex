/* eslint-disable no-undef */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const {
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		minWidth: 320,
		frame: false,
		titleBarStyle: 'hiddenInset',
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

app.whenReady().then(() => {
	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));
});

ipcMain.handle('keytarGet', async (event, arg) => {
	const { keytar } = require('keytar');
	console.log(keytar);

	console.log(`Using keytar to retrieve "${arg.key}"...`);
	return await keytar.getPassword('audex', arg.key);
});

ipcMain.handle('keytarSet', async (event, arg) => {
	const { keytar } = require('keytar');
	console.log(keytar);

	console.log(`Using keytar to store "${arg.key}"...`);
	await keytar.setPasssword('audex', arg.key, arg.value);
});
