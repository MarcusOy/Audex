import {
	IconButton,
	INavLinkGroup,
	Nav,
	Panel,
	PanelType,
	Stack,
	Text,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React from 'react';
import { useLocation } from 'react-router-dom';
import LoggedInUser from './LoggedInUser';

const HeaderBar = () => {
	// Menu Panel
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(
		false
	);

	const { pathname } = useLocation();

	return (
		<>
			<Stack
				style={{ marginBottom: 20 }}
				tokens={{ childrenGap: 8 }}
				horizontal
				verticalAlign='center'
			>
				<IconButton
					iconProps={{ iconName: 'CollapseMenu' }}
					title='Menu'
					ariaLabel='Menu'
					onClick={openPanel}
				/>
				<Text variant='xLarge'>Audex</Text>
				<div style={{ flexGrow: 1 }} />
				{/* <IconButton
					iconProps={{ iconName: 'Home' }}
					title='Home'
					ariaLabel='Home'
				/> */}
				<LoggedInUser />
				{/* <IconButton
					iconProps={{ iconName: 'Settings' }}
					title='Settings'
					ariaLabel='Settings'
				/> */}
			</Stack>
			<Panel
				isLightDismiss
				isOpen={isOpen}
				onDismiss={dismissPanel}
				closeButtonAriaLabel='Close'
				type={PanelType.smallFixedNear}
			>
				<Text variant='xLargePlus'>Audex</Text>

				<Nav
					onLinkClick={dismissPanel}
					selectedKey={pathname}
					ariaLabel='Menu'
					groups={menuLinkGroups}
				/>
			</Panel>
		</>
	);
};

export default HeaderBar;

const menuLinkGroups: INavLinkGroup[] = [
	{
		links: [
			{
				name: 'Home',
				url: '/Home/Recent',
				links: [
					{
						name: 'Recent',
						url: '/Home/Recent',
						key: '/Home/Recent',
					},
					{
						name: 'Files',
						url: '/Home/Files',
						key: '/Home/Files',
					},
					{
						name: 'Devices',
						url: '/Home/Devices',
						key: '/Home/Devices',
					},
				],
				isExpanded: true,
			},
			{
				name: 'User Management',
				url: '/Users',
				key: '/Users',
			},
			{
				name: 'Settings',
				url: '/Settings',
				key: '/Settings',
			},
		],
	},
];
