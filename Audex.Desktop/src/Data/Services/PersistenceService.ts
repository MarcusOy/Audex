// const { ipcRenderer } = window.require('electron');

class PersistenceService {
	static async getUnsecured(key: string): Promise<string | null> {
		return await window.localStorage.getItem(key);
	}
	static async setUnsecured(key: string, value: string) {
		await window.localStorage.setItem(key, value);
	}

	static async getSecured(key: string): Promise<string | null> {
		// return await ipcRenderer.invoke('keytarGet', key);
		return await this.getUnsecured(key); // TODO: figure out keytar mess
	}
	static async setSecured(key: string, value: string) {
		// await ipcRenderer.invoke('keytarSet', { key, value });
		await this.setUnsecured(key, value); // TODO: figure out keytar mess
	}
}

export default PersistenceService;
