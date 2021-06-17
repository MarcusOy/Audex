import { IconButton, Panel, PanelType, SearchBox } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import Spacer from '../Spacer';

const SearchPanel = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<IconButton
				iconProps={{ iconName: 'Search' }}
				onClick={() => setIsOpen(true)}
			/>
			<Panel
				isLightDismiss
				isOpen={isOpen}
				onDismiss={() => setIsOpen(false)}
				type={PanelType.smallFixedFar}
				closeButtonAriaLabel='Close'
				headerText='Search everything'
			>
				<Spacer />
				<SearchBox />
			</Panel>
		</>
	);
};

export default SearchPanel;
