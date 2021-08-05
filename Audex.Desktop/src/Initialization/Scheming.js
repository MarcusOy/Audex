/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');

exports.schemingInit = () => {
	if (!app.requestSingleInstanceLock()) {
		app.quit(); // another instance is running
	}

	// win32 arg catch
	app.on('second-instance', (e, argv, wkdir) => {
		let mainWindow = BrowserWindow.getAllWindows()[0];
		if (!mainWindow.isFocused() || mainWindow.isMinimized()) {
			mainWindow.restore();
			mainWindow.focus();
		}
	});

	// other platform arg catch
	app.on('open-url', function (event, data) {
		event.preventDefault();
		link = data;
	});

	app.setAsDefaultProtocolClient('audex');
};
