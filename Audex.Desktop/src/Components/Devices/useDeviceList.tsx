import { useEffect, useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import { IDeviceIconProps } from './DeviceIcon';
import { IDevicesListProps } from './DevicesList';

const useDeviceList = (p?: IDevicesListProps) => {
	const currentDeviceId = DataStore.useState(
		(s) => s.Authentication.deviceId
	);
	const deviceState = DataStore.useState((s) => s.Identity?.user.devices);
	const [devices, setDevices] = useState<IDeviceIconProps[]>([]);

	const isLoading = deviceState == null;
	const searchText = p != null ? p.searchText : null;

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
			if (searchText && searchText != '')
				ds = ds.filter(
					(i) =>
						i.name
							.toUpperCase()
							.includes(searchText.toUpperCase()) ||
						i.type.toUpperCase().includes(searchText.toUpperCase())
				);
			if (p && !p.hideCurrentDevice && currentD != undefined)
				ds.unshift({ ...currentD, isCurrentDevice: true });
			setDevices(ds);
		}
	}, [deviceState, searchText]);

	return { isLoading, devices };
};

export default useDeviceList;
