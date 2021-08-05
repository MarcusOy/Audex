const { ipcRenderer } = window.require('electron');
import {
	START_NOTIFICATION_SERVICE,
	NOTIFICATION_SERVICE_STARTED,
	NOTIFICATION_SERVICE_ERROR,
	NOTIFICATION_RECEIVED as ON_NOTIFICATION_RECEIVED,
	TOKEN_UPDATED,
} from 'electron-push-receiver/src/constants';
import { getOS } from '../Helpers';

interface IOneSignalNotification {
	data: {
		vis: string;
		alert: string;
		pri: string;
		custom: string;
		title: string;
		bicon: string;
		o: string;
	};
	from: string;
	priority: string;
	collapse_key: string;
}
interface IOneSignalAction {
	i: string;
	n: string;
}

class NotificationService {
	static isInit: boolean;

	static init() {
		if (this.isInit) return;

		// Listen for service successfully started
		ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_: any, token: any) => {
			console.log('Notification service started.', token);
			fetch('https://onesignal.com/api/v1/players', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					app_id: '8fb24c7f-a4cc-44c1-bb67-73d9fc5d3d8b',
					identifier: token,
					device_model: `${getOS()} (Electron)`,
					device_type: 1,
				}),
			})
				.then((res) => {
					return res.json();
				})
				.then((body) => {
					console.log(body);
				});
		});
		// Handle notification errors
		ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_: any, error: any) => {
			console.log('Notification service error.', error);
		});
		// Send FCM token to backend
		ipcRenderer.on(TOKEN_UPDATED, (_: any, token: any) => {
			console.log('Notification service token updated.', token);
		});
		// Display notification
		ipcRenderer.on(
			ON_NOTIFICATION_RECEIVED,
			(_: any, notification: IOneSignalNotification) => {
				console.log('Notification received.', notification);
				NotificationService.pushOneSignalNotification(notification);
			}
		);
		// Start service
		ipcRenderer.send(START_NOTIFICATION_SERVICE, '296239027125');

		this.isInit = true;
	}
	static reInit() {
		ipcRenderer.removeAllListeners(NOTIFICATION_SERVICE_ERROR);
		ipcRenderer.removeAllListeners(NOTIFICATION_SERVICE_STARTED);
		ipcRenderer.removeAllListeners(TOKEN_UPDATED);
		ipcRenderer.removeAllListeners(ON_NOTIFICATION_RECEIVED);
		NotificationService.isInit = false;
		NotificationService.init();
	}

	static pushOneSignalNotification(notification: IOneSignalNotification) {
		ipcRenderer.send('PushOneSignalNotification', notification);
		ipcRenderer.once(
			'PushOneSignalNotificationAction',
			(action: string) => {
				console.log(action);
			}
		);
		// if (getOS() == 'WINDOWS') {
		// 	toast({
		// 		title: notification.data.title,
		// 		messsage: notification.data.alert,
		// 	});
		// }
		// const notif = new Notification(notification.data.title, {
		// 	body: notification.data.alert,
		// 	requireInteraction: true,
		// 	// actions: (JSON.parse(
		// 	// 	notification.data.o
		// 	// ) as IOneSignalAction[]).map((a) => {
		// 	// 	return {
		// 	// 		title: a.n,
		// 	// 		action: a.i,
		// 	// 	};
		// 	// }),
		// });
		// console.log(notif);
		// notif.onclick = () => console.log('notification clicked');
		// notif.addEventListener('notificationclick', (a) => {
		// 	console.log(a);
		// });
	}
}

export default NotificationService;
