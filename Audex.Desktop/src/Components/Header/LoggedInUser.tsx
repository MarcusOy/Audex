import {
	mergeStyleSets,
	Persona,
	PersonaSize,
	PersonaPresence,
	ContextualMenu,
	getTheme,
	IPersonaSharedProps,
	IContextualMenuItem,
	Text,
	Spinner,
	SpinnerSize,
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import IdentityService from '../../Data/Services/IdentityService';
import Spacer from '../Spacer';
import { getInitials } from '../../Data/Helpers';
import { useHistory } from 'react-router-dom';

const LoggedInUser = () => {
	const identityState = DataStore.useState((s) => s.Identity?.user);
	const history = useHistory();
	const { palette } = getTheme();

	// Account Context Menu
	const linkRef = React.useRef(null);
	const [showContextualMenu, setShowContextualMenu] = React.useState(false);
	const onShowContextualMenu = React.useCallback(
		(ev: React.MouseEvent<HTMLElement>) => {
			ev.preventDefault(); // don't navigate
			setShowContextualMenu(true);
		},
		[]
	);
	const onHideContextualMenu = React.useCallback(
		() => setShowContextualMenu(false),
		[]
	);

	const accountMenuItems: IContextualMenuItem[] = [
		{
			key: 'account',
			text: 'Account',
			onClick: () => history.push('/Settings/Account'),
		},
		{
			key: 'logout',
			text: 'Log Out',
			onClick: () => IdentityService.logOut(),
		},
	];

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
		<div
			className={
				mergeStyleSets({
					persona: {
						selectors: {
							'&:hover': {
								background: palette.neutralLight,
							},
						},
						cursor: 'pointer',
						padding: 5,
					},
				}).persona
			}
		>
			<Persona
				{...examplePersona}
				size={PersonaSize.size32}
				presence={PersonaPresence.online}
				ref={linkRef}
				onClick={onShowContextualMenu}
			/>
			<ContextualMenu
				items={accountMenuItems}
				hidden={!showContextualMenu}
				target={linkRef}
				onItemClick={onHideContextualMenu}
				onDismiss={onHideContextualMenu}
			/>
		</div>
	);
};

export default LoggedInUser;
