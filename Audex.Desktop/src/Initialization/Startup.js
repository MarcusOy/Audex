/* eslint-disable no-undef */
const alert = require('alert');
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
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

//#region DownloadHandlers
const electronDl = require('electron-dl');
electronDl({ directory: app.getPath('downloads') + '/Audex' });

ipcMain.handle('download', async (event, { key, urls }) => {
	let downloadGroupId = require('faker').random.alphaNumeric(10);
	let folderDir = platformPath(app.getPath('downloads') + `/Audex/${key}`);
	let ogDir = folderDir;

	let dupCount = 0;
	while (fs.existsSync(folderDir)) {
		dupCount++;
		folderDir = `${ogDir} (${dupCount})`;
	}

	if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir);

	Array.from(urls).map((url, index) => {
		let savePath = ''; // For use in progress event
		setTimeout(() => {
			electronDl.download(mainWindow, url, {
				directory: folderDir,
				onStarted: (i) => {
					savePath = i.getSavePath();
					event.sender.send(`download-started`, {
						item: {
							groupId: downloadGroupId,
							groupName: key,
							path: i.getSavePath(),
							size: i.getTotalBytes(),
						},
					});
				},
				onProgress: (p) => {
					event.sender.send(`download-progress`, {
						progress: {
							...p,
							groupId: downloadGroupId,
							groupName: key,
							path: savePath,
						},
					});
				},
				onCancel: (i) => {
					event.sender.send(`download-canceled`, {
						item: {
							groupId: downloadGroupId,
							groupName: key,
							path: i.getSavePath(),
							size: i.getTotalBytes(),
						},
					});
				},
				onCompleted: (f) => {
					event.sender.send(`download-completed`, {
						groupId: downloadGroupId,
						groupName: key,
						file: f,
					});
				},
			});
		}, 500 * index);
	});
});

ipcMain.handle('open-downloads-folder', async (event, _) => {
	const openExplorer = require('open-file-explorer');
	let folderDir = platformPath(app.getPath('downloads') + `/Audex/`);
	if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir);

	openExplorer(folderDir, (err) => {
		if (err) {
			alert(err);
		} else {
			//Do Something
		}
	});
});

ipcMain.handle('show-download', async (event, { path }) => {
	const openExplorer = require('open-file-explorer');
	let downloadPath = platformPath(path);

	openExplorer(downloadPath, (err) => {
		if (err) {
			alert(err);
		} else {
			//Do Something
		}
	});
});

ipcMain.handle('show-download-in-folder', async (event, { path }) => {
	const openExplorer = require('open-file-explorer');
	let fullPath = normalizePath(path).split('/');
	fullPath.pop();
	let folderPath = platformPath(fullPath.join('/'));

	openExplorer(folderPath, (err) => {
		if (err) {
			alert(err);
		} else {
			//Do Something
		}
	});
});

function isDev() {
	// return process.argv[2] == '--dev';
	return true;
}
//#endregion

//#region PlatformFunctions
const os = require('os');
const platforms = {
	WINDOWS: 'WINDOWS',
	MAC: 'MAC',
	LINUX: 'LINUX',
	SUN: 'SUN',
	OPENBSD: 'OPENBSD',
	ANDROID: 'ANDROID',
	AIX: 'AIX',
};

const platformsNames = {
	win32: platforms.WINDOWS,
	darwin: platforms.MAC,
	linux: platforms.LINUX,
	sunos: platforms.SUN,
	openbsd: platforms.OPENBSD,
	android: platforms.ANDROID,
	aix: platforms.AIX,
};

const currentPlatform = platformsNames[os.platform()];

function platformPath(path) {
	if (currentPlatform == platformsNames.win32)
		return path.replaceAll('/', '\\');

	return path.replaceAll('\\', '/');
}
function normalizePath(path) {
	return path.replaceAll('\\', '/');
}
//#endregion
