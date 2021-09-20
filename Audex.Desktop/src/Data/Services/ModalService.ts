import { IClipPanel } from '../../Components/Modals/ClipPanel';
import { IStackPanel } from '../../Components/Modals/StackPanel';
import { DataStore } from '../DataStore/DataStore';

class ModalService {
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
	static openClipModal({ clipId }: IClipPanel) {
		DataStore.update((s) => {
			s.Modals.ClipPanel.clipId = clipId;
			s.Modals.ClipPanel.isOpen = true;
		});
	}
	static closeClipModal() {
		DataStore.update((s) => {
			s.Modals.ClipPanel.isOpen = false;
		});
	}
}
export default ModalService;
