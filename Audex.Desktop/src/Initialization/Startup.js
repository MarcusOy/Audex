/* eslint-disable no-undef */
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const {
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

if (isDev()) {
	try {
		require('electron-reloader')(module, { watchRenderer: false });
	} catch {
		console.log('electron-reloader failed to load.');
	}
}

let mainWindow;

// const DownloadManager = require('electron-download-manager');
// DownloadManager.register({
// 	downloadFolder: app.getPath('downloads') + '/Audex',
// });

const electronDl = require('electron-dl');
electronDl({ directory: app.getPath('downloads') + '/Audex' });

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

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	if (isDev()) mainWindow.webContents.toggleDevTools();
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

ipcMain.handle('download', async (event, { key, urls }) => {
	let folderDir = app.getPath('downloads') + `/Audex/${key}`;
	if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir);

	Array.from(urls).map((url, index) => {
		setTimeout(() => {
			electronDl.download(mainWindow, url, {
				directory: folderDir,
				onStarted: (i) => {
					event.sender.send(`download-started`, {
						item: {
							path: i.getSavePath(),
							size: i.getTotalBytes(),
						},
					});
				},
				onProgress: (p) => {
					event.sender.send(`download-${key}-progress`, {
						progress: p,
					});
				},
				onCancel: (i) => {
					event.sender.send(`download-canceled`, {
						item: {
							path: i.getSavePath(),
							size: i.getTotalBytes(),
						},
					});
				},
				onCompleted: (f) => {
					event.sender.send(`download-completed`, { file: f });
				},
			});
		}, 500 * index);
	});
});

ipcMain.handle('open-downloads-folder', async (event, _) => {
	const openExplorer = require('open-file-explorer');
	let folderDir = app.getPath('downloads') + `/Audex/`;
	if (!fs.existsSync(folderDir)) await fs.mkdir(folderDir);

	openExplorer(folderDir, (err) => {
		if (err) {
			console.log(err);
		} else {
			//Do Something
		}
	});
});

function isDev() {
	return process.argv[2] == '--dev';
}
