import React from 'react';
import FilePanel from './FilePanel';

export interface IModal {
	isOpen?: boolean;
}

const Modals = () => {
	return (
		<>
			<FilePanel />
		</>
	);
};

export default Modals;
