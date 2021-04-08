import { IFileUnit } from '../../Components/Uploading/FileUnit';
import { DataStore } from '../DataStore/DataStore';
import ModalService from './ModalService';
import ToastService from './ToastService';

class FileService {
	static initialAddFiles(files: FileList): void {
		DataStore.update((s) => {
			s.Upload.Files = Array.from(files) as Array<IFileUnit>;
		});
		// ModalService.openFileTransferModal({ mode: 'upload' });
	}
	static addFiles(files: IFileUnit[]): void {
		DataStore.update((s) => {
			const a: IFileUnit[] = new Array<IFileUnit>()
				.concat(DataStore.getRawState().Upload.Files)
				.concat(files);
			s.Upload.Files = a;
		});
	}

	static fileSuccess(i: number, uid: string): void {
		DataStore.update((s) => {
			s.Upload.Files[i].success = true;
			s.Upload.Files[i].uid = uid;
		});
	}
	static removeFile(file: IFileUnit): void {
		DataStore.update((s) => {
			s.Upload.Files = DataStore.getRawState().Upload.Files.filter(
				(f) => f != file
			);
		});
	}
}

export default FileService;
