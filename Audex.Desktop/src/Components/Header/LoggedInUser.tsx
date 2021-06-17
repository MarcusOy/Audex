import { gql, useQuery } from '@apollo/client';
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
import { WHO_AM_I } from '../../Data/Queries';
import Spacer from '../Spacer';

const accountMenuItems: IContextualMenuItem[] = [
	{
		key: 'account',
		text: 'Account',
		onClick: () => console.log('Account'),
	},
	{
		key: 'logout',
		text: 'Log Out',
		onClick: () => IdentityService.logOut(),
	},
];

const getInitials = (fullName) => {
	const allNames = fullName.trim().split(' ');
	const initials = allNames.reduce(
		(acc, curr, index) => {
			if (index === 0 || index === allNames.length - 1) {
				acc = `${acc}${curr.charAt(0).toUpperCase()}`;
			}
			return acc;
		},
		['']
	);
	return initials;
};

const LoggedInUser = () => {
	const identityState = DataStore.useState((s) => s.Identity);
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
