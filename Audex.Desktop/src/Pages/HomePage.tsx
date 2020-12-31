import { Pivot, PivotItem, Label } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import MenuBar from '../Components/MenuBar';
import RecentFiles from '../Components/RecentFiles';

interface HomePageParams {
	tab: string;
}

const HomePage = () => {
	const history = useHistory();
	const { tab } = useParams<HomePageParams>();

	const onTabClick = (item) => {
		history.push(`/Home/${item.props.headerText}`);
	};

	useEffect(() => {
		console.log(tab);
	}, [tab]);

	return (
		<>
			<Pivot
				linkSize={'large'}
				selectedKey={tab}
				onLinkClick={onTabClick}
			>
				<PivotItem itemKey='Recent' headerText='Recent'>
					<RecentFiles />
				</PivotItem>
				<PivotItem itemKey='Files' headerText='Files'>
					<MenuBar type='Files' />
					<Label>Files</Label>
				</PivotItem>
				<PivotItem itemKey='Devices' headerText='Devices'>
					<MenuBar type='Devices' />
					<Label>Devices</Label>
				</PivotItem>
			</Pivot>
		</>
	);
};

export default HomePage;
