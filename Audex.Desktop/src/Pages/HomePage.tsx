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
import StacksTab from '../Pages/Tabs/StacksTab';
import DashboardTab from '../Pages/Tabs/DashboardTab';
import FileDrop from '../Components/Uploading/FileDrop';
import { DataStore } from '../Data/DataStore/DataStore';
import NotificationBadge, { Effect } from 'react-notification-badge';
import ClipsTab from './Tabs/ClipsTab';

interface HomePageParams {
	tab: string;
}

const HomePage = () => {
	const history = useHistory();
	const { tab } = useParams<HomePageParams>();

	const tabs = {
		Dashboard: <DashboardTab />,
		Stacks: <StacksTab />,
		Clips: <ClipsTab />,
	};

	const onTabClick = (item) => {
		history.push(`/Home/${item.props.headerText}`);
	};

	const incomingTransfers = DataStore.useState(
		(s) => s.Identity?.device.incomingTransfers
	);

	return (
		<>
			<Pivot
				linkSize={'large'}
				selectedKey={tab}
				onLinkClick={onTabClick}
			>
				<PivotItem
					itemKey='Dashboard'
					headerText='Dashboard'
					itemCount={
						incomingTransfers && incomingTransfers.length > 0
							? incomingTransfers.length
							: undefined
					}
				/>
				<PivotItem itemKey='Stacks' headerText='Stacks' />
				<PivotItem itemKey='Clips' headerText='Clips' />
			</Pivot>
			<div
				style={{
					flex: 1,
					overflowY: 'scroll',
				}}
			>
				{tabs[tab]}
			</div>
		</>
	);
};

export default HomePage;
