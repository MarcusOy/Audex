import {
	IconButton,
	INavLinkGroup,
	Nav,
	Panel,
	PanelType,
	SearchBox,
	Stack,
	Text,
	useTheme,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import LoggedInUser from './LoggedInUser';
import menuLinkGroups from './MenuItems';
import useResponsive from '../../Hooks/useResponsive';
import Logo from './Logo';
import DownloadManager from '../Downloading/DownloadManager';
import SearchPanel from './SearchPanel';
import Spacer from '../Spacer';

const HeaderBar = () => {
	// Menu Panel
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
		useBoolean(false);

	const { pathname } = useLocation();
	const history = useHistory();

	const { palette } = useTheme();

	return (
		<Stack>
			<div
				style={{
					// height: 35,
					// backgroundColor: 'rgba(243, 242, 241, 0.0)',
					display: 'flex',
					borderBottom: '1px solid rgb(243, 242, 241)',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					WebkitAppRegion: 'drag',
					WebkitUserSelect: 'none',
					padding: 13,
				}}
			>
				<div
					style={{
						backgroundColor: '#00000026',
						height: 12,
						width: 12,
						borderRadius: 12,
						marginRight: 8,
					}}
				></div>
				<div
					style={{
						backgroundColor: '#00000026',
						height: 12,
						width: 12,
						borderRadius: 12,
						marginRight: 8,
					}}
				></div>
				<div
					style={{
						backgroundColor: '#00000026',
						height: 12,
						width: 12,
						borderRadius: 12,
					}}
				></div>
			</div>
			<Stack
				style={{
					paddingBottom: 10,
					position: 'sticky',
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
				<div
					style={{
						flexGrow: 1,
						marginTop: -5,
						// height: 20,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						WebkitAppRegion: 'drag',
						WebkitUserSelect: 'none',
					}}
				>
					<Logo />
				</div>
				{/* <Spacer grow /> */}
				<SearchPanel />
				<DownloadManager />
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
		</Stack>
	);
};

export default HeaderBar;
