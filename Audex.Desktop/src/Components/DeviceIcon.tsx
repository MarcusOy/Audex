import {
	ContextualMenu,
	ContextualMenuItemType,
	getTheme,
	IContextualMenuItem,
	mergeStyleSets,
	Stack,
	Text,
} from '@fluentui/react';
import React, { useRef } from 'react';

interface Props {
	name: string;
	img: string;
	color: string;
	hasOnClick?: boolean;
	onClick?: () => void | undefined;

	disableContextMenu?: boolean;
}

const DeviceIcon = (p: Props) => {
	const menuProps: IContextualMenuItem[] = [
		{
			key: 'section',
			itemType: ContextualMenuItemType.Section,
			sectionProps: {
				topDivider: true,
				bottomDivider: true,
				title: p.name,
				items: [
					{
						key: 'transfer',
						text: 'Transfer new stack',
						iconProps: { iconName: 'Send' },
					},
					{
						key: 'request',
						text: 'Request stack',
						iconProps: { iconName: 'WorkFlow' },
					},
					{
						key: 'text',
						text: 'Get info',
						iconProps: { iconName: 'Info' },
					},
				],
			},
		},
	];

	const linkRef = useRef(null);
	const [showContextualMenu, setShowContextualMenu] = React.useState(false);
	const onShowContextualMenu = React.useCallback(
		(ev: React.MouseEvent<HTMLElement>) => {
			ev.preventDefault(); // don't navigate
			if (!p.disableContextMenu) setShowContextualMenu(true);
		},
		[]
	);
	const onHideContextualMenu = React.useCallback(
		() => setShowContextualMenu(false),
		[]
	);

	return (
		<Stack
			style={{ width: 75, marginRight: 10 }}
			horizontalAlign='center'
			key={p.name}
			onClick={p.hasOnClick ? p.onClick : onShowContextualMenu}
			className={
				mergeStyleSets({
					stack: {
						selectors: {
							'&:hover': {
								background: getTheme().palette.neutralLight,
							},
						},
						cursor: 'pointer',
						padding: 5,
					},
				}).stack
			}
		>
			<Stack
				style={{
					// borderStyle: 'solid',
					// borderImageSlice: 1,
					// borderWidth: 2,
					// borderImageSource:
					// 	'linear-gradient(to left, #743ad5, #d53a9d)',
					borderRadius: 45,
					width: 45,
					height: 45,
					backgroundColor: p.color,
					// boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
				}}
				verticalAlign='center'
				horizontalAlign='center'
			>
				<img
					src={
						p.img ??
						'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
					}
					width={30}
					height={30}
				/>
			</Stack>
			<Text style={{ fontSize: 10 }}>{p.name}</Text>
			<div ref={linkRef} />
			<ContextualMenu
				items={menuProps}
				hidden={!showContextualMenu}
				target={linkRef}
				onItemClick={onHideContextualMenu}
				onDismiss={onHideContextualMenu}
			/>
		</Stack>
	);
};

export default DeviceIcon;
