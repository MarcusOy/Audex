import React from 'react';
import { IconButton, Spinner, SpinnerSize } from '@fluentui/react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import DeviceIcon, { AddDeviceIcon, IDeviceIconProps } from './DeviceIcon';
import useDeviceList from './useDeviceList';

export interface IDevicesListProps
	extends React.HTMLAttributes<HTMLDivElement> {
	hideCurrentDevice?: boolean;
	hideAddButton?: boolean;
	searchText?: string;
}

const DevicesList = (p: IDevicesListProps) => {
	const { isLoading, devices } = useDeviceList(p);

	// Add add button to list if props say to
	let ds = devices;
	if (!p.hideAddButton) ds = [...devices, addButton];

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
			{!isLoading ? (
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
					data={ds.map(
						(i: IDeviceIconProps) =>
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
	componentOverride: <AddDeviceIcon />,
};

export default DevicesList;
