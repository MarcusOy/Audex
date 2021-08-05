import React from 'react';
import { IconButton, Spinner, SpinnerSize } from '@fluentui/react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import DeviceIcon, { AddDeviceIcon, IDeviceIconProps } from './DeviceIcon';
import { useEffect, useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';

interface IDevicesListProps extends React.HTMLAttributes<HTMLDivElement> {
	hideCurrentDevice?: boolean;
	hideAddButton?: boolean;
	compactMode?: boolean;
	searchText?: string;
}

const DevicesList = (p: IDevicesListProps) => {
	const currentDeviceId = DataStore.useState(
		(s) => s.Authentication.deviceId
	);
	const deviceState = DataStore.useState((s) => s.Identity?.user.devices);
	const [devices, setDevices] = useState<IDeviceIconProps[]>([]);

	useEffect(() => {
		if (deviceState) {
			let currentD: IDeviceIconProps | undefined;
			let ds: IDeviceIconProps[] = deviceState
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
			if (p.searchText && p.searchText != '')
				ds = ds.filter(
					(i) =>
						i.name
							.toUpperCase()
							.includes(p.searchText!.toUpperCase()) ||
						i.type
							.toUpperCase()
							.includes(p.searchText!.toUpperCase())
				);
			if (!p.hideCurrentDevice && currentD != undefined)
				ds.unshift({ ...currentD, isCurrentDevice: true });
			if (!p.hideAddButton) ds.push(addButton);
			setDevices(ds);
		}
	}, [deviceState, p.searchText]);

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

const addButton: IDeviceIconProps = {
	id: '000',
	name: 'Add button',
	type: 'add',
	color: '',
	componentOverride: <AddDeviceIcon />,
};

export default DevicesList;
