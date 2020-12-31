import { Panel } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { useBoolean } from '@fluentui/react-hooks';

interface Props {
	isOpen: boolean;
	dismiss: () => void;
}

const FilePanel = (props: Props) => {
	return (
		<Panel
			headerText='File'
			isOpen={props.isOpen}
			onDismiss={props.dismiss}
		>
			<p>Content goes here.</p>
		</Panel>
	);
};
export default FilePanel;
