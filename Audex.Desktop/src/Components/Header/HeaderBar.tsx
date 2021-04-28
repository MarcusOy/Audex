import {
	IconButton,
	INavLinkGroup,
	Nav,
	Panel,
	PanelType,
	SearchBox,
	Stack,
	Text,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import LoggedInUser from './LoggedInUser';
import menuLinkGroups from './MenuItems';
import useResponsive from '../../Hooks/useResponsive';
import Logo from './Logo';

const HeaderBar = () => {
	// Menu Panel
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(
		false
	);

	const { pathname } = useLocation();
	const history = useHistory();

	const {
		size,
		orientation,
		screenIsAtLeast,
		screenIsAtMost,
	} = useResponsive();

	return (
		<>
			<Stack
				style={{
					// marginBottom: 20,
					paddingTop: 20,
					paddingBottom: 10,
					// borderBottom: '1px solid rgb(243, 242, 241)',
					position: 'sticky',
					WebkitUserSelect: 'none',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					WebkitAppRegion: 'drag',
					// '-webkit-app-region': 'drag',
				}}
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
				<Logo />
				{screenIsAtMost('sm') ? (
					<div style={{ flexGrow: 1 }} />
				) : (
					<div
						style={{
							flexGrow: 1,
							marginLeft: 75,
							marginRight: 75,
							justifyContent: 'center',
						}}
					>
						<SearchBox
							style={{
								maxWidth: 600,
							}}
							placeholder='Search'
							// underlined
							onSearch={(newValue) =>
								console.log('value is ' + newValue)
							}
						/>
					</div>
				)}
				<LoggedInUser />
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
					onLinkClick={(e, i) => {
						history.push(i.key);
						dismissPanel();
					}}
					selectedKey={pathname}
					ariaLabel='Menu'
					groups={menuLinkGroups}
				/>
			</Panel>
		</>
	);
};

export default HeaderBar;
