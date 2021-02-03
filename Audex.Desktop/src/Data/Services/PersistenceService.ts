const { ipcRenderer } = require('electron');

class PersistenceService {
	static async getUnsecured(key: string): Promise<string | null> {
		return await window.localStorage.getItem(key);
	}
	static async setUnsecured(key: string, value: string) {
		await window.localStorage.setItem(key, value);
	}

	static async getSecured(key: string): Promise<string | null> {
		return await ipcRenderer.invoke('keytarGet', key);
	}
	static async setSecured(key: string, value: string) {
		await ipcRenderer.invoke('keytarSset', { key, value });
	}
}

export default PersistenceService;
