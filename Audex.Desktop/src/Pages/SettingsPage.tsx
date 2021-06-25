import {
	Pivot,
	PivotItem,
	Label,
	Text,
	Image,
	CommandBarButton,
	Stack,
	PersonaSize,
	PersonaPresence,
	Spinner,
	SpinnerSize,
	IPersonaSharedProps,
	Persona,
} from '@fluentui/react';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BackToTop from '../Components/BackToTop';
import StacksTab from './Tabs/StacksTab';
import MenuBar from '../Components/MenuBar';
import DashboardTab from './Tabs/DashboardTab';
import FileDrop from '../Components/Uploading/FileDrop';
import { Grid } from 'fluentui-react-grid';
import { DataStore } from '../Data/DataStore/DataStore';
import Spacer from '../Components/Spacer';
import { getInitials } from '../Data/Helpers';
import AccountSettingsTab from './Tabs/AccountSettingsTab';
import DeviceSettingsTab from './Tabs/DeviceSettingsTab';

interface SettingsPageParams {
	tab: string;
}

const SettingsPage = () => {
	const identityState = DataStore.useState((s) => s.Identity?.user);

	const history = useHistory();
	const { tab } = useParams<SettingsPageParams>();

	const onTabClick = (item) => {
		history.push(`/Settings/${item.props.headerText}`);
	};

	if (identityState == undefined)
		return (
			<>
				<Spinner size={SpinnerSize.small} />
				<Spacer orientation='horizontal' />
			</>
		);

	// Persona Settings
	const examplePersona: IPersonaSharedProps = {
		// imageUrl: TestImages.personaFemale,
		imageInitials: identityState.username
			? getInitials(identityState.username)
			: 'NLI',
		text: identityState.username ?? 'notloggedin',
		secondaryText: identityState.group.name ?? 'nogroup',
		tertiaryText: 'On Audex desktop client (MacOS)',
		showSecondaryText: true,
	};

	return (
		<>
			<Grid dir='ltr' style={{ padding: 10 }}>
				<Grid.Row>
					<Grid.Col sizeSm={12} sizeMd={12} sizeLg={5}>
						<Stack tokens={{ childrenGap: 10, padding: 10 }}>
							<Spacer size={40} />
							<Persona
								{...examplePersona}
								size={PersonaSize.size72}
								presence={PersonaPresence.dnd}
							/>
							<CommandBarButton
								iconProps={{ iconName: 'Forward' }}
								style={{
									height: 30,
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
								text='Go to stacks'
							/>
						</Stack>
					</Grid.Col>
					<Grid.Col sizeSm={12} sizeMd={12} sizeLg={7}>
						<Pivot
							linkSize={'large'}
							selectedKey={tab}
							onLinkClick={onTabClick}
						>
							<PivotItem itemKey='Account' headerText='Account'>
								{/* <AccountSettingsTab /> */}
							</PivotItem>
							<PivotItem itemKey='Device' headerText='Device'>
								{/* <DeviceSettingsTab /> */}
							</PivotItem>
						</Pivot>
					</Grid.Col>
				</Grid.Row>
			</Grid>
		</>
	);
};

export default SettingsPage;
