import { IFilePanel } from '../../Components/Modals/FilePanel';
import { IFileTransferPanel } from '../../Components/Modals/FileTransferPanel';
import { DataStore } from '../DataStore/DataStore';

class ModalService {
	static openFileTransferModal({ mode }: IFileTransferPanel) {
		DataStore.update((s) => {
			s.Modals.FileTransfer.isOpen = true;
			s.Modals.FileTransfer.mode = mode;
		});
	}
	static closeFileTransferModal() {
		DataStore.update((s) => {
			s.Modals.FileTransfer.isOpen = false;
			s.Upload.Files = [];
		});
	}

	static openFileModal({ fileId }: IFilePanel) {
		DataStore.update((s) => {
			s.Modals.FilePanel.fileId = fileId;
			s.Modals.FilePanel.isOpen = true;
		});
	}
	static closeFileModal() {
		DataStore.update((s) => {
			s.Modals.FilePanel.isOpen = false;
		});
	}
}
export default ModalService;
