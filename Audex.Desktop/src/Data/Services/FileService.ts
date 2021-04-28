import { IFileUnit } from './../../Components/Uploading/FileUnit';
import { DataStore } from '../DataStore/DataStore';
import ModalService from './ModalService';
import ToastService from './ToastService';

class FileService {
	static initialAddFiles(files: FileList): void {
		DataStore.update((s) => {
			s.Upload.FileUnits = new Array(files.length)
				.fill(null)
				.map<IFileUnit>(() => {
					return {
						sent: false,
						success: false,
						progress: 0,
						uid: '',
					};
				});
			s.Upload.Files = Array.from(files) as Array<File>;
		});
		// ModalService.openFileTransferModal({ mode: 'upload' });
	}
	static addFiles(files: File[]): void {
		DataStore.update((s) => {
			const f: File[] = new Array<File>()
				.concat(DataStore.getRawState().Upload.Files)
				.concat(files);
			const fu: IFileUnit[] = new Array<IFileUnit>()
				.concat(DataStore.getRawState().Upload.FileUnits)
				.concat(
					new Array(files.length).fill(null).map<IFileUnit>(() => {
						return {
							sent: false,
							success: false,
							progress: 0,
							uid: '',
						};
					})
				);
			s.Upload.FileUnits = fu;
			s.Upload.Files = f;
		});
	}
	static fileSent(i: number): void {
		DataStore.update((s) => {
			s.Upload.FileUnits[i].sent = true;
		});
	}
	static fileProgress(i: number, p: number): void {
		DataStore.update((s) => {
			s.Upload.FileUnits[i].progress = p;
		});
	}
	static fileSuccess(i: number, uid: string): void {
		DataStore.update((s) => {
			s.Upload.FileUnits[i].success = true;
			s.Upload.FileUnits[i].uid = uid;
		});
	}
	static removeFile(i: number): void {
		DataStore.update((s) => {
			s.Upload.Files = DataStore.getRawState().Upload.Files.filter(
				(_, index) => i != index
			);
			s.Upload.FileUnits = DataStore.getRawState().Upload.FileUnits.filter(
				(_, index) => i != index
			);
		});
	}
	static removeAllFiles(): void {
		DataStore.update((s) => {
			s.Upload.FileUnits = [];
			s.Upload.Files = [];
			s.Upload.CurrentStackContext = undefined;
		});
	}
}

export default FileService;
