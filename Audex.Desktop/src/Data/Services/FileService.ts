import { IFileUnit } from '../../Components/Uploading/FileUnit';
import { DataStore } from '../DataStore/DataStore';
import ModalService from './ModalService';

class FileService {
	static initialAddFiles(files: FileList) {
		DataStore.update((s) => {
			s.Upload.Files = Array.from(files) as Array<IFileUnit>;
		});
		ModalService.openFileTransferModal({ mode: 'upload' });
	}
	static addFiles(files: IFileUnit[]) {
		DataStore.update((s) => {
			const a: IFileUnit[] = new Array<IFileUnit>()
				.concat(DataStore.getRawState().Upload.Files)
				.concat(files);
			s.Upload.Files = a;
		});
	}

	static fileSuccess(i: number) {
		DataStore.update((s) => {
			s.Upload.Files[i]?.success == true;
		});
	}
	static removeFile(file: IFileUnit) {
		DataStore.update((s) => {
			s.Upload.Files = DataStore.getRawState().Upload.Files.filter(
				(f) => f != file
			);
		});
	}
}

export default FileService;
