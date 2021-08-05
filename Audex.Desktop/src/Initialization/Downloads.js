/* eslint-disable no-undef */
const { platformPath, normalizePath } = require('./Helpers');
const { app, ipcMain, BrowserWindow } = require('electron');
const fs = require('fs');

exports.downloadHandlersInit = () => {
	const electronDl = require('electron-dl');
	electronDl({ directory: app.getPath('downloads') + '/Audex' });

	ipcMain.handle('download', async (event, { key, urls }) => {
		let downloadGroupId = require('faker').random.alphaNumeric(10);
		let folderDir = platformPath(
			app.getPath('downloads') + `/Audex/${key}`
		);
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
				electronDl.download(BrowserWindow.getAllWindows()[0], url, {
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
};
