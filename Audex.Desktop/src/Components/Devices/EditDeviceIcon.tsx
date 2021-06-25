import { Stack } from '@fluentui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getOS } from '../../Data/Helpers';
import DeviceIcon from './DeviceIcon';

interface IEditDeviceIconProps {
	deviceTypes: { key: string; name: string; color: string }[];
}

const EditDeviceIcon = (p: IEditDeviceIconProps) => {
	const platform = getOS();

	const { watch } = useFormContext();
	const watchedDeviceName = watch('name');
	const watchedDeviceType = watch('deviceType', platform);

	const actualDeviceType =
		p.deviceTypes.filter((dt) => dt.key == watchedDeviceType).length == 1
			? p.deviceTypes.filter((dt) => dt.key == watchedDeviceType)[0].name
			: 'Other';
	const actualDeviceColor =
		p.deviceTypes.filter((dt) => dt.key == watchedDeviceType).length == 1
			? p.deviceTypes.filter((dt) => dt.key == watchedDeviceType)[0].color
			: '#000';

	return (
		<Stack style={{ alignItems: 'center' }}>
			<DeviceIcon
				id='test'
				type={actualDeviceType}
				name={watchedDeviceName ? watchedDeviceName : 'This device'}
				color={actualDeviceColor}
				disableContextMenu
			/>
		</Stack>
	);
};

export default EditDeviceIcon;
