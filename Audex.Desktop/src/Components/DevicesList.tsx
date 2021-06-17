import * as React from 'react';
import {
	IconButton,
	Stack,
	Label,
	Separator,
	Text,
	Spinner,
	SpinnerSize,
} from '@fluentui/react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import faker from 'faker';
import DeviceIcon, { AddDeviceIcon, IDeviceIconProps } from './DeviceIcon';
import { DataStore } from '../Data/DataStore/DataStore';
import { useEffect, useState } from 'react';
import {
	FaAndroid,
	FaApple,
	FaAppStore,
	FaAppStoreIos,
	FaDesktop,
	FaGlobe,
	FaLinux,
	FaServer,
	FaWindows,
} from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';

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

const addButton: IDeviceIconProps = {
	name: 'Add button',
	icon: <></>,
	color: '',
	componentOverride: <AddDeviceIcon />,
};

const DevicesList = () => {
	const currentDeviceId = DataStore.useState(
		(s) => s.Authentication.deviceId
	);
	const deviceState = DataStore.useState((s) => s.Identity?.devices);
	const [devices, setDevices] = useState<IDeviceIconProps[]>([]);

	useEffect(() => {
		if (deviceState) {
			let currentD: IDeviceIconProps | undefined;
			const ds: IDeviceIconProps[] = deviceState
				.map((d) => {
					const newDevice = {
						name: d.name,
						color: d.deviceType.color,
						icon: getIconComponentFromDeviceType(d.deviceType.name),
					};
					if (d.id == currentDeviceId.replaceAll('-', '')) {
						currentD = newDevice;
						return;
					}
					return newDevice;
				})
				.filter((i) => i != undefined) as IDeviceIconProps[];
			if (currentD != undefined)
				ds.unshift({ ...currentD, isCurrentDevice: true });
			ds.push(addButton);
			setDevices(ds);
		}
	}, [deviceState]);

	return (
		<div
			style={{
				minHeight: 69,
				backgroundColor: 'rgba(243, 242, 241, 0.2)',
				borderTop: '1px solid rgb(243, 242, 241)',
				borderBottom: '1px solid rgb(243, 242, 241)',
				padding: '10px 0',
			}}
		>
			{deviceState ? (
				<ScrollMenu
					// menuStyle={{ width: '100vh' }}
					alignCenter={false}
					dragging={false}
					itemStyle={{ outline: 'none' }}
					arrowLeft={
						<IconButton
							iconProps={{ iconName: 'ChevronLeftMed' }}
						/>
					}
					arrowRight={
						<IconButton
							iconProps={{ iconName: 'ChevronRightMed' }}
						/>
					}
					wrapperStyle={{ flexGrow: 1 }}
					hideArrows={true}
					hideSingleArrow={true}
					data={devices.map(
						(i) =>
							i.componentOverride ?? (
								<DeviceIcon key={i.name} {...i} />
							)
					)}
				/>
			) : (
				<Spinner size={SpinnerSize.small} />
			)}
		</div>
	);
};

export default DevicesList;
