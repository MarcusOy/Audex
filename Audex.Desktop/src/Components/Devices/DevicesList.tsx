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
import { DataStore } from '../../Data/DataStore/DataStore';
import { IconBaseProps } from 'react-icons/lib';

const addButton: IDeviceIconProps = {
	id: '000',
	name: 'Add button',
	type: 'add',
	color: '',
	componentOverride: <AddDeviceIcon />,
};

const DevicesList = () => {
	const currentDeviceId = DataStore.useState(
		(s) => s.Authentication.deviceId
	);
	const deviceState = DataStore.useState((s) => s.Identity?.user.devices);
	const [devices, setDevices] = useState<IDeviceIconProps[]>([]);

	useEffect(() => {
		if (deviceState) {
			let currentD: IDeviceIconProps | undefined;
			const ds: IDeviceIconProps[] = deviceState
				.map((d) => {
					const newDevice = {
						id: d.id,
						name: d.name,
						color: d.deviceType.color,
						type: d.deviceType.name,
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
								<DeviceIcon key={i.id} {...i} />
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
