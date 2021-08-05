import {
	Pivot,
	PivotItem,
	Label,
	Text,
	IPivotItemProps,
	Icon,
	useTheme,
} from '@fluentui/react';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BackToTop from '../Components/BackToTop';
import StacksTab from '../Pages/Tabs/StacksTab';
import DashboardTab from '../Pages/Tabs/DashboardTab';
import FileDrop from '../Components/Uploading/FileDrop';
import { DataStore } from '../Data/DataStore/DataStore';
import NotificationBadge, { Effect } from 'react-notification-badge';

interface HomePageParams {
	tab: string;
}

const HomePage = () => {
	const history = useHistory();
	const { tab } = useParams<HomePageParams>();

	const onTabClick = (item) => {
		history.push(`/Home/${item.props.headerText}`);
	};

	const incomingTransfers = DataStore.useState(
		(s) => s.Identity?.device.incomingTransfers
	);

	const _customRenderer = (
		link?: IPivotItemProps,
		defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null
	) => {
		if (!link || !defaultRenderer) {
			return null;
		}

		return (
			<span style={{ flex: '0 1 100%' }}>
				<div
					style={{
						position: 'static',
						width: 10,
						display:
							incomingTransfers && incomingTransfers.length > 0
								? 'inline-block'
								: 'none',
						height: 15,
						marginRight: 5,
						marginLeft: 10,
					}}
				>
					<NotificationBadge
						count={incomingTransfers && incomingTransfers.length}
						effect={Effect.SCALE}
						style={{
							fontSize: 10,
							minWidth: 3,
							right: 0,
							top: 1,
							backgroundColor: useTheme().palette.orangeLight,
						}}
					/>
				</div>
				{defaultRenderer({
					...link,
					itemIcon: undefined,
					style: { marginLeft: 20 },
				})}
			</span>
		);
	};

	return (
		<>
			<FileDrop>
				<Pivot
					linkSize={'large'}
					selectedKey={tab}
					onLinkClick={onTabClick}
				>
					<PivotItem
						itemKey='Dashboard'
						headerText='Dashboard'
						onRenderItemLink={_customRenderer}
					>
						<DashboardTab />
					</PivotItem>
					<PivotItem itemKey='Stacks' headerText='Stacks'>
						<StacksTab />
					</PivotItem>
					<PivotItem itemKey='Clips' headerText='Clips'>
						<Label>Clips</Label>
					</PivotItem>
				</Pivot>
				<BackToTop />
			</FileDrop>
		</>
	);
};

export default HomePage;
