import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';
import OfflineModal from './OfflineModal';
import DeviceSetupModal from './DeviceSetupModal';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<DeviceSetupModal />
			<OfflineModal />
			<Toasts />
			<StackPanel />
			{/* <FileTransferPanel /> */}
		</>
	);
};

export default Modals;
