import {
	CommandBarButton,
	DefaultButton,
	IconButton,
	Image,
	Stack,
	Text,
} from '@fluentui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import ActivityFeed from '../../Components/Activity/ActivityFeed';
import { Grid } from 'fluentui-react-grid';
import Spacer from '../../Components/Spacer';
import { DataStore } from '../../Data/DataStore/DataStore';

const DashboardTab = () => {
	const history = useHistory();

	const onGoToStacksClick = () => {
		history.push(`/Home/Stacks`);
	};

	return (
		<Grid dir='ltr' style={{ padding: 10 }}>
			<Grid.Row>
				<Grid.Col sizeSm={12} sizeMd={12} sizeLg={4}>
					<Stack tokens={{ childrenGap: 10 }}>
						<Text variant='xLarge'>Good afternoon, Marcus.</Text>
						<Text variant='large'>Usage and limits</Text>
						<Image
							style={{ marginLeft: 'auto', marginRight: 'auto' }}
							src='https://via.placeholder.com/150'
						/>
						<CommandBarButton
							iconProps={{ iconName: 'Forward' }}
							style={{
								height: 30,
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							text='Go to stacks'
							onClick={onGoToStacksClick}
						/>
					</Stack>
				</Grid.Col>
				<Grid.Col sizeSm={12} sizeMd={12} sizeLg={8}>
					<ActivityFeed />
				</Grid.Col>
			</Grid.Row>
		</Grid>
	);
};

export default DashboardTab;
