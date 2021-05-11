const { ipcRenderer } = window.require('electron');
import faker from 'faker';
import { DataStore } from '../DataStore/DataStore';

export interface IDownload {
	fileName: string;
}

class DownloadService {
	static downloadFiles(fileIds: string[]): void {
		const key = faker.random.alphaNumeric(10);
		const links = [
			'https://i.imgur.com/xineeuw.jpg',
			'https://i.imgur.com/RguiWa6.jpg',
			'https://i.imgur.com/JR4Z0aD.jpg',
			'https://i.imgur.com/ccvEJO1.jpg',
			'https://i.imgur.com/yqZoShd.jpg',
		];

		ipcRenderer.on(`download-started`, (_: any, { item }: any) => {
			if (item) console.log(item);
		});
		ipcRenderer.on(
			`download-${key}-progress`,
			(_: any, { progress }: any) => {
				if (progress) console.log(progress);
			}
		);
		ipcRenderer.on(`download-canceled`, (_: any, { item }: any) => {
			if (item) console.log(item);
		});
		ipcRenderer.on(`download-completed`, (_: any, { file }: any) => {
			if (file) console.log(file);
		});
		ipcRenderer.invoke('download', { key: key, urls: links });

		DataStore.update((d) => {
			d.Download.NewItems = d.Download.NewItems + links.length;
		});
	}

	// static downloadStacks(stackIds: string[]): void {}

	static dismissNewItems(): void {
		DataStore.update((d) => {
			d.Download.NewItems = 0;
		});
	}

	static openDownloadsFolder(): void {
		ipcRenderer.invoke('open-downloads-folder', {});
	}
}

export default DownloadService;
