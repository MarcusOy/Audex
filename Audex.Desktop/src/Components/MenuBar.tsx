import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import ModalService from '../Data/Services/ModalService';
import ToastService, {
	TestBlocked,
	TestInfo,
} from '../Data/Services/ToastService';

const _baseItems: ICommandBarItemProps[] = [
	{
		key: 'newItem',
		text: 'New stack',
		iconProps: { iconName: 'Add' },
		// subMenuProps: {
		// 	items: [
		// 		{
		// 			key: 'upload',
		// 			text: 'File Upload',
		// 			iconProps: { iconName: 'OpenFile' },
		// 			onClick: () =>
		// 				ModalService.openFileTransferModal({ mode: 'upload' }),
		// 		},
		// 		{
		// 			key: 'transfer',
		// 			text: 'File Transfer',
		// 			iconProps: { iconName: 'ChangeEntitlements' },
		// 			onClick: () =>
		// 				ModalService.openFileTransferModal({
		// 					mode: 'transfer',
		// 				}),
		// 		},
		// 	],
		// },
	},
];

const numSelected = 1;
const zeroOrOneSelected = false;

const _filesItems: ICommandBarItemProps[] = [
	{
		key: 'download',
		text: `Download ${numSelected}`,
		iconProps: { iconName: 'Download' },
		onClick: () => console.log('Download'),
		split: true,
		subMenuProps: {
			items: [
				{
					key: 'zip',
					text: `Download ${numSelected} as .zip`,
				},
				{
					key: 'unencrypted',
					text: `Download ${numSelected} as encrypted`,
				},
			],
		},
	},
	{
		key: 'transfer',
		text: 'Transfer stack',
		iconProps: { iconName: 'Send' },
		onClick: () => console.log('Transfer'),
		split: true,
	},
	{
		key: 'share',
		text: 'Share stack',
		iconProps: { iconName: 'Share' },
		onClick: () => console.log('Share'),
		subMenuProps: {
			items: [
				{
					key: 'link',
					text: 'Share as Link',
				},
				{
					key: 'pin',
					text: 'Share with PIN',
				},
			],
		},
	},
	{
		key: 'delete',
		text: `Delete ${numSelected}...`,
		onClick: () => console.log('delete'),
		iconProps: { iconName: 'Trash' },
	},
	{
		key: 'rename',
		text: `Rename ${zeroOrOneSelected}...`,
		onClick: () => console.log('Rename'),
		// disabled: selection.length > 1,
		iconProps: { iconName: 'Edit' },
	},
];

const _devicesItems: ICommandBarItemProps[] = [
	{
		key: 'upload',
		text: 'Upload',
		iconProps: { iconName: 'Upload' },
	},
];

// const _overflowItems: ICommandBarItemProps[] = [

// ];

const _farItems: ICommandBarItemProps[] = [
	{
		key: 'tile',
		text: 'Grid view',
		// This needs an ariaLabel since it's icon-only
		ariaLabel: 'Grid view',
		iconOnly: true,
		iconProps: { iconName: 'Tiles' },
		onClick: () => ToastService.push(TestInfo(), 3),
	},
	{
		key: 'help',
		text: 'Help',
		ariaLabel: 'Help',
		iconOnly: true,
		iconProps: { iconName: 'Help' },
		onClick: () => ToastService.push(TestBlocked()),
	},
];

interface Props {
	type: 'Recent' | 'Files' | 'Devices';
	itemsSelected?: boolean;
}

const MenuBar = (props: Props) => {
	const [items, setItems] = useState<ICommandBarItemProps[]>();

	useEffect(() => {
		let i = [];
		i = i.concat(_baseItems);
		switch (props.type) {
			case 'Files':
				i = i.concat(_filesItems);
				break;
			case 'Devices':
				i = i.concat(_devicesItems);
				break;
		}
		setItems(i);
	}, []);

	return (
		<CommandBar
			style={{ marginTop: 10, position: 'sticky', top: 0, zIndex: 100 }}
			items={items}
			// overflowItems={_overflowItems}
			farItems={_farItems}
			ariaLabel='Use left and right arrow keys to navigate between commands'
		/>
	);
};

export default MenuBar;
