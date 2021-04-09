import React from 'react';
import StackPanel from './StackPanel';
import Toasts from './Toasts';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<Toasts />
			<StackPanel />
			{/* <FileTransferPanel /> */}
		</>
	);
};

export default Modals;
