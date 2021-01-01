import { Panel } from '@fluentui/react';
import { useStoreState } from 'pullstate';
import React from 'react';
import { DataStore } from '../Stores/DataStore';
import { IModal } from './Modals';

export interface IFilePanel extends IModal {
	fileId: string;
}

const FilePanel = () => {
	const modalState = DataStore.useState((s) => s.Modals.FilePanel);

	const onDismissed = () => {
		DataStore.update((s) => {
			s.Modals.FilePanel.isOpen = false;
		});
	};

	return (
		<Panel
			headerText='File'
			isOpen={modalState.isOpen}
			onDismissed={onDismissed}
		>
			<p>Content goes here.</p>
		</Panel>
	);
};
export default FilePanel;
