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
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import IdentityService from '../../Data/Services/IdentityService';
import { WHO_AM_I } from '../../Data/Queries';

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

const LoggedInUser = () => {
	const state = DataStore.useState((s) => s.Authentication);
	const { data, loading, error } = useQuery(WHO_AM_I);

	if (loading) return <Text>Loading</Text>;
	console.log(data);

	const { palette } = getTheme();

	// Persona Settings
	const examplePersona: IPersonaSharedProps = {
		// imageUrl: TestImages.personaFemale,
		imageInitials: 'MO',
		text: data?.username ?? 'notloggedin',
		secondaryText: data?.group?.name ?? 'nogroup',
		tertiaryText: 'On Audex desktop client (MacOS)',
		showSecondaryText: true,
	};

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
