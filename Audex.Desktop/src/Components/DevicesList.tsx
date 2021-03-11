import * as React from 'react';
import { IconButton, Stack, Label, Separator, Text } from '@fluentui/react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import faker from 'faker';
import DeviceIcon from './DeviceIcon';

// list of items
const list = [
	{
		name: 'Add device',
		img: 'https://img.icons8.com/material/344/ffffff/add-column.png',
		color: '#46483E',
		hasOnClick: true,
		onClick: () => {
			alert('asdf');
		},
	},
	{
		name: 'iPhone 6',
		img: 'https://img.icons8.com/material/344/ffffff/ios-logo.png',
		color: '#000000',
	},
	{
		name: 'Pixel 3a XL',
		img: 'https://img.icons8.com/material/344/ffffff/android-os--v2.png',
		color: '#85C808',
	},
	{
		name: 'Ubuntu',
		img: 'https://img.icons8.com/material/344/ffffff/ubuntu.png',
		color: '#dd4814',
	},
	{
		name: 'Windows',
		img:
			'https://img.icons8.com/material/344/ffffff/windows-client--v1.png',
		color: '#00AEF0',
	},
	{
		name: 'MacOS',
		img: 'https://img.icons8.com/material/344/ffffff/mac-client.png',
		color: '#000000',
	},
	// { name: 'item7' },
	// { name: 'item8' },
	// { name: 'item9' },
	// { name: 'item6' },
	// { name: 'item7' },
	// { name: 'item8' },
	// { name: 'item9' },
];

const DevicesList = () => {
	return (
		<div
			style={{
				backgroundColor: 'rgba(243, 242, 241, 0.2)',
				borderBottom: '1px solid rgb(243, 242, 241)',
				padding: '10px 0',
			}}
		>
			<ScrollMenu
				// menuStyle={{ width: '100vh' }}
				alignCenter={false}
				dragging={false}
				itemStyle={{ outline: 'none' }}
				arrowLeft={
					<IconButton iconProps={{ iconName: 'ChevronLeftMed' }} />
				}
				arrowRight={
					<IconButton iconProps={{ iconName: 'ChevronRightMed' }} />
				}
				hideArrows={true}
				hideSingleArrow={true}
				data={list.map((i) => (
					<DeviceIcon key={i.name} {...i} />
				))}
			/>
		</div>
	);
};

export default DevicesList;
