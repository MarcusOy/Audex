/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { isDev } = require('./Helpers');
const {
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

//#region ElectronStartup
let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: isDev() ? 1200 : 720,
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
	// Initializing push notifications
	const { notificationHandlersInit } = require('./Notifications');
	notificationHandlersInit();

	// Initializing download manager
	const { downloadHandlersInit } = require('./Downloads');
	downloadHandlersInit();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	if (isDev()) mainWindow.webContents.toggleDevTools();
}

// URI scheming and instancing
const { schemingInit } = require('./Scheming');
schemingInit();

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
//#endregion

//#region DevExtensions
if (isDev()) {
	try {
		require('electron-reloader')(module, { watchRenderer: false });
	} catch {
		console.log('electron-reloader failed to load.');
	}
}

app.whenReady().then(() => {
	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));
});
//#endregion

//#region KeytarHandlers
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
//#endregion
