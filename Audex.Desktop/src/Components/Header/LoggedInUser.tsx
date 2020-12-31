import {
	mergeStyleSets,
	Persona,
	PersonaSize,
	PersonaPresence,
	ContextualMenu,
	getTheme,
	IPersonaSharedProps,
	IContextualMenuItem,
} from '@fluentui/react';
import React from 'react';

const accountMenuItems: IContextualMenuItem[] = [
	{
		key: 'account',
		text: 'Account',
		onClick: () => console.log('Account'),
	},
	// {
	// 	key: 'divider_1',
	// 	itemType: ContextualMenuItemType.Divider,
	// },
	{
		key: 'logout',
		text: 'Log Out',
		onClick: () => console.log('Log Out'),
	},
];

const LoggedInUser = () => {
	const { palette } = getTheme();

	// Persona Settings
	const examplePersona: IPersonaSharedProps = {
		// imageUrl: TestImages.personaFemale,
		imageInitials: 'MO',
		text: 'Marcus Orciuch',
		secondaryText: 'Administrator',
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
			// style={{
			// 	cursor: 'pointer',
			// }}
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
