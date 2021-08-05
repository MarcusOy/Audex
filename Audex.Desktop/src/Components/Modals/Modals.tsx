import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';
import OfflineModal from './OfflineModal';
import DeviceSetupModal from './DeviceSetupModal';
import UploadToast from './UploadToast';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<DeviceSetupModal />
			<OfflineModal />
			<Toasts />
			<UploadToast />
			<StackPanel />
			{/* <FileTransferPanel /> */}
		</>
	);
};

export default Modals;
