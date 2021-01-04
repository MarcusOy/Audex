import React from 'react';
import FilePanel from './FilePanel';
import { FileTransferPanel } from './FileTransferPanel';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<FilePanel />
			<FileTransferPanel />
		</>
	);
};

export default Modals;
