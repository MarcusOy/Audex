const { ipcRenderer } = window.require('electron');
import { DataStore } from '../DataStore/DataStore';
import { groupBy } from '../Helpers';

export interface IDownload {
	fileName: string;
	size: number;
	progress: number;
	isDownloaded: boolean;
	isCanceled: boolean;
	startedOn: Date;
	groupId: string;
	groupName: string;
}

class DownloadService {
	static isInit: boolean;

	static init(): void {
		if (this.isInit) return;

		ipcRenderer.on(`download-started`, (_: any, { item }: any) => {
			if (item)
				DataStore.update((s) => {
					s.Download.Downloads.set(item.path, {
						fileName: item.path,
						size: item.size,
						progress: 0,
						isDownloaded: false,
						isCanceled: false,
						startedOn: new Date(),
						groupId: item.groupId,
						groupName: item.groupName,
					});
				});
		});
		ipcRenderer.on(`download-progress`, (_: any, { progress }: any) => {
			if (progress && progress.percent)
				DataStore.update((s) => {
					s.Download.Downloads.get(progress.path)!.progress =
						progress.percent;
				});
		});
		ipcRenderer.on(`download-canceled`, (_: any, { item }: any) => {
			if (item)
				DataStore.update((s) => {
					s.Download.Downloads.get(item.path)!.isCanceled = true;
				});
		});
		ipcRenderer.on(`download-completed`, (_: any, { file }: any) => {
			if (file) {
				DataStore.update((s) => {
					s.Download.Downloads.get(file.path)!.isDownloaded = true;
				});
				// this.checkDownloadGroupCompletion(file);
			}
		});
		this.isInit = true;
	}

	static downloadFiles(downloadTokens: string[], groupName?: string): void {
		this.init();

		const selectedServer = DataStore.getRawState().Servers.serverList.get(
			DataStore.getRawState().Servers.selectedServerHostname
		)!;
		const uri = `${selectedServer.prefix}${selectedServer.hostName}${selectedServer.downloadEndpoint}`;
		const links = downloadTokens.map((t) => {
			return `${uri}/${t}`;
		});

		console.log(links);

		ipcRenderer.invoke('download', { key: groupName, urls: links });

		DataStore.update((d) => {
			d.Download.NewItems = d.Download.NewItems + links.length;
		});
	}

	static checkDownloadGroupCompletion(file: any) {
		const downloadGroups: IDownload[][] = Object.values(
			groupBy(
				Array.from(
					DataStore.getRawState().Download.Downloads.entries()
				).map(([k, d]) => {
					return d;
				}),
				'groupId',
				false
			)
		);
		// const downloadGroup =
	}

	static dismissNewItems(): void {
		DataStore.update((d) => {
			d.Download.NewItems = 0;
		});
	}

	static clearSessionDownloads(): void {
		DataStore.update((s) => {
			s.Download.Downloads.clear();
		});
	}

	static openDownloadsFolder(): void {
		ipcRenderer.invoke('open-downloads-folder', {});
	}

	static showDownload(path: string): void {
		ipcRenderer.invoke('show-download', { path });
	}
	static showDownloadInFolder(path: string): void {
		ipcRenderer.invoke('show-download-in-folder', { path });
	}
}

export default DownloadService;
