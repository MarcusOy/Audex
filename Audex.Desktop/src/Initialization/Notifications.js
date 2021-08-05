/* eslint-disable no-undef */
const {
	app,
	BrowserWindow,
	ipcMain,
	session,
	Notification,
} = require('electron');
const toast = require('powertoast');
const { setup: setupPushReceiver } = require('electron-push-receiver');
const { currentPlatform, platformNames } = require('./Helpers');

exports.notificationHandlersInit = () => {
	setupPushReceiver(BrowserWindow.getAllWindows()[0]);
	app.setAppUserModelId(process.execPath);

	ipcMain.on('PushOneSignalNotification', (_, notif) => {
		if (currentPlatform == platformNames.win32) {
			toast({
				title: notif.data.title,
				message: notif.data.alert,
				scenario: 'reminder',
				button: JSON.parse(notif.data.o).map((a) => {
					return {
						text: a.n,
						onClick: a.i,
					};
				}),
			});
			return;
		}

		// new Notification({
		// 	title: notif.data.title,
		// 	body: notif.data.alert,
		// 	// icon: notif.data.bicon,
		// 	timeoutType: 'never',
		// 	actions: JSON.parse(notif.data.o).map((a) => {
		// 		return {
		// 			text: a.n,
		// 			type: 'button',
		// 		};
		// 	}),
		// }).show();
		// ipcMain.emit(
		// 	'PushOneSignalNotificationAction',
		// 	{}
		// );
	});
};
