import { Pivot, PivotItem, Label } from '@fluentui/react';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BackToTop from '../Components/BackToTop';
import StacksTab from '../Pages/Tabs/StacksTab';
import DashboardTab from '../Pages/Tabs/DashboardTab';
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
					<PivotItem itemKey='Dashboard' headerText='Dashboard'>
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
