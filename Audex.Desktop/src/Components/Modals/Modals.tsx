import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';
import { FileTransferPanel } from './FileTransferPanel';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<Toasts />
			<StackPanel />
			<FileTransferPanel />
		</>
	);
};

export default Modals;
