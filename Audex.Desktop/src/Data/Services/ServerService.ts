import { DataStore } from '../DataStore/DataStore';

export interface IServer {
	prefix: string;
	hostName: string;
	apiVersion: string;
	apiEndpoint: string;
	downloadEndpoint: string;
	isOfficial: boolean;
	isOnline: boolean;
}

class ServerService {
	static init(): void {
		window.addEventListener('online', () => {
			console.log('Network change (online). Checking connectivity...');
			this.isSelectedServerUp();
		});
		window.addEventListener('offline', () => {
			console.log('Network change (offline). Checking connectivity...');
			this.isSelectedServerUp();
		});
	}
	static async isServerUp(server: IServer): Promise<boolean> {
		let isOnline = false;
		try {
			// Try and fetch Heatbeat endpoint
			const response = await fetch(
				`${server.prefix}${server.hostName}/api/${server.apiVersion}/Heartbeat`
			);
			// Return true if response is 200
			isOnline = response.ok;
		} catch (error) {
			// Return false if fetch throws exception
			isOnline = false;
		} finally {
			const { serverList } = DataStore.getRawState().Servers;
			console.log(
				`Server ${server.hostName} connectivity check. isOnline? ${isOnline}`
			);
			console.log(serverList);
			// If the passed in server is in the server list, change its status
			if (serverList.has(server.hostName))
				DataStore.update((s) => {
					s.Servers.serverList.get(server.hostName)!.isOnline =
						isOnline;
				});
		}
		return isOnline;
	}

	static async isSelectedServerUp(): Promise<boolean> {
		const { serverList, selectedServerHostname } =
			DataStore.getRawState().Servers;
		return selectedServerHostname
			? await this.isServerUp(serverList.get(selectedServerHostname)!)
			: false;
	}
}

export default ServerService;
