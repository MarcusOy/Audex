import { IStackPanel } from '../../Components/Modals/StackPanel';
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

	static openStackModal({ stackId }: IStackPanel) {
		DataStore.update((s) => {
			s.Modals.StackPanel.stackId = stackId;
			s.Modals.StackPanel.isOpen = true;
		});
	}
	static closeFileModal() {
		DataStore.update((s) => {
			s.Modals.StackPanel.isOpen = false;
		});
	}
}
export default ModalService;
