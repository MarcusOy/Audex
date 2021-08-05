import {
	Callout,
	ContextualMenu,
	ContextualMenuItemType,
	getTheme,
	IconButton,
	IContextualMenuItem,
	Link,
	mergeStyleSets,
	Stack,
	Text,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useRef, useState } from 'react';
import {
	FaServer,
	FaWindows,
	FaApple,
	FaLinux,
	FaGlobe,
	FaAppStore,
	FaAndroid,
	FaDesktop,
} from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';

export interface IDeviceIconProps {
	id: string;
	name: string;
	type: string;
	color: string;
	isCurrentDevice?: boolean;

	componentOverride?: JSX.Element;

	hasOnClick?: boolean;
	onClick?: () => void | undefined;

	disableContextMenu?: boolean;
}

const getIconComponentFromDeviceType = (type: string) => {
	const baseProps: IconBaseProps = {
		color: 'white',
		size: 20,
	};

	switch (type) {
		case 'Audex Server':
			return <FaServer {...baseProps} />;
		case 'Windows':
			return <FaWindows {...baseProps} />;
		case 'MacOS':
			return <FaApple {...baseProps} />;
		case 'Linux':
			return <FaLinux {...baseProps} />;
		case 'Web':
			return <FaGlobe {...baseProps} />;
		case 'iOS':
			return <FaAppStore {...baseProps} />; // TODO: use better icon
		case 'Android':
			return <FaAndroid {...baseProps} />;
		default:
			return <FaDesktop {...baseProps} />;
	}
};

const DeviceIcon = (p: IDeviceIconProps) => {
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
			style={{ width: 75 }}
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
					borderRadius: 45,
					width: 45,
					height: 45,
					backgroundColor: p.color,
				}}
				verticalAlign='center'
				horizontalAlign='center'
			>
				{getIconComponentFromDeviceType(p.type)}
			</Stack>
			<Text style={{ fontSize: 10 }}>
				{p.isCurrentDevice ? 'This device' : p.name}
			</Text>
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

export const AddDeviceIcon = () => {
	const [isCalloutVisible, setIsCalloutVisible] = useState(false);
	const buttonId = useId('add-device-button');

	return (
		<>
			<IconButton
				id={buttonId}
				onClick={() => setIsCalloutVisible(!isCalloutVisible)}
				text='Add device'
				iconProps={{ iconName: 'Add' }}
			/>
			{isCalloutVisible && (
				<Callout
					style={{ width: 250, padding: '20px 24px' }}
					role='alertdialog'
					gapSpace={0}
					target={`#${buttonId}`}
					onDismiss={() => setIsCalloutVisible(false)}
					setInitialFocus
				>
					<Stack tokens={{ childrenGap: 10 }}>
						<Text block variant='xLarge'>
							Adding a new device
						</Text>
						<Text block variant='small'>
							In order to add a new device, open up the Audex
							client on your new device, log in using your
							username and password, then confirm your identity by
							using a two factor code generated by your
							authenticator app (ex: Google Authenticator, Authy,
							etc).
						</Text>
						<Link href='http://microsoft.com' target='_blank'>
							Learn more
						</Link>
					</Stack>
				</Callout>
			)}
		</>
	);
};
