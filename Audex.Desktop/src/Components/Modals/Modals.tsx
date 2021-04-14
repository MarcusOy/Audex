import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';
import OfflineModal from './OfflineModal';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<OfflineModal />
			<Toasts />
			<StackPanel />
			{/* <FileTransferPanel /> */}
		</>
	);
};

export default Modals;
