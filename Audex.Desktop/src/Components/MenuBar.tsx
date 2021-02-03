import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import ModalService from '../Data/Services/ModalService';

const _baseItems: ICommandBarItemProps[] = [
	{
		key: 'newItem',
		text: 'New',
		iconProps: { iconName: 'Add' },
		subMenuProps: {
			items: [
				{
					key: 'upload',
					text: 'File Upload',
					iconProps: { iconName: 'OpenFile' },
					onClick: () =>
						ModalService.openFileTransferModal({ mode: 'upload' }),
				},
				{
					key: 'transfer',
					text: 'File Transfer',
					iconProps: { iconName: 'ChangeEntitlements' },
					onClick: () =>
						ModalService.openFileTransferModal({
							mode: 'transfer',
						}),
				},
			],
		},
	},
];

const _recentItems: ICommandBarItemProps[] = [
	{
		key: 'upload',
		text: 'Upload',
		iconProps: { iconName: 'Upload' },
	},
];

const _filesItems: ICommandBarItemProps[] = [
	{
		key: 'download',
		text: 'Download',
		iconProps: { iconName: 'Download' },
		onClick: () => console.log('Download'),
	},
	{
		key: 'share',
		text: 'Share',
		iconProps: { iconName: 'Share' },
		onClick: () => console.log('Share'),
	},
	{
		key: 'move',
		text: 'Move to...',
		onClick: () => console.log('Move to'),
		iconProps: { iconName: 'MoveToFolder' },
	},
	{
		key: 'copy',
		text: 'Copy to...',
		onClick: () => console.log('Copy to'),
		iconProps: { iconName: 'Copy' },
	},
	{
		key: 'rename',
		text: 'Rename...',
		onClick: () => console.log('Rename'),
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
		onClick: () => console.log('Tiles'),
	},
	{
		key: 'info',
		text: 'Info',
		// This needs an ariaLabel since it's icon-only
		ariaLabel: 'Info',
		iconOnly: true,
		iconProps: { iconName: 'Info' },
		onClick: () => console.log('Info'),
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
			case 'Recent':
				i = i.concat(_recentItems);
				break;
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
