import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';
import OfflineModal from './OfflineModal';
import DeviceSetupModal from './DeviceSetupModal';
import UploadToast from './UploadToast';
import ClipPanel from './ClipPanel';

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
			<ClipPanel />
			{/* <FileTransferPanel /> */}
		</>
	);
};

export default Modals;
