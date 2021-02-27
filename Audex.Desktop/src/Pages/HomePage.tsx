import { Pivot, PivotItem, Label } from '@fluentui/react';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BackToTop from '../Components/BackToTop';
import StacksList from '../Components/StacksList';
import MenuBar from '../Components/MenuBar';
import RecentFiles from '../Components/RecentFiles';
import FileDrop from '../Components/Uploading/FileDrop';

interface HomePageParams {
	tab: string;
}

const HomePage = () => {
	const history = useHistory();
	const { tab } = useParams<HomePageParams>();

	const onTabClick = (item) => {
		history.push(`/Home/${item.props.headerText}`);
	};

	return (
		<>
			<FileDrop>
				<Pivot
					linkSize={'large'}
					selectedKey={tab}
					onLinkClick={onTabClick}
				>
					<PivotItem itemKey='Recent' headerText='Recent'>
						<RecentFiles />
					</PivotItem>
					<PivotItem itemKey='Stacks' headerText='Stacks'>
						<StacksList />
					</PivotItem>
					<PivotItem itemKey='Devices' headerText='Devices'>
						<MenuBar type='Devices' />
						<Label>Devices</Label>
					</PivotItem>
				</Pivot>
				<BackToTop />
			</FileDrop>
		</>
	);
};

export default HomePage;
