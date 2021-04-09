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
}
export default ModalService;
