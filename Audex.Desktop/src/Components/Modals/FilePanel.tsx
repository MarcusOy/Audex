import { Panel } from '@fluentui/react';
import { useStoreState } from 'pullstate';
import React from 'react';
import { DataStore } from '../../Data/DataStore';
import { IModal } from './Modals';

export interface IFilePanel extends IModal {
	fileId: string;
}

const FilePanel = () => {
	const modalState = useStoreState(DataStore, (s) => s.Modals.FilePanel);

	const onDismissed = () => {
		DataStore.update((s) => {
			s.Modals.FilePanel.isOpen = false;
		});
	};

	return (
		<Panel
			headerText='File'
			isOpen={modalState.isOpen}
			onDismiss={onDismissed}
			isLightDismiss
		>
			<p>File ID: {modalState.fileId}</p>
		</Panel>
	);
};
export default FilePanel;