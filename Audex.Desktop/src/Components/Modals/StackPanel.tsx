/* eslint-disable react/display-name */
import {
	CommandBar,
	DefaultButton,
	IColumn,
	ICommandBarItemProps,
	List,
	Panel,
	PanelType,
	PrimaryButton,
	Separator,
	Stack,
	Text,
} from '@fluentui/react';
import { useStoreState } from 'pullstate';
import React, { useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import ModalService from '../../Data/Services/ModalService';
import Spacer from '../Spacer';
import { IModal } from './Modals';
import FileList, { ListClassNames } from '../FilesList';
import faker from 'faker';

export interface IStackPanel extends IModal {
	stackId: string;
}

export interface IStackDetail {
	name: string;
	value: string;
}

const stackDetails: IStackDetail[] = [
	{
		name: 'Date created',
		value: 'December 1st, 2020',
	},
	{
		name: 'Total file size',
		value: '123 KB',
	},
	{
		name: 'Downloads',
		value: '253',
	},
	{
		name: 'Visibility',
		value: 'Public (with link)',
	},
	{
		name: 'Date Created',
		value: 'December 1st, 2020',
	},
];

const onDetailRender = (i: IStackDetail | undefined) => {
	return (
		<Stack horizontal style={{ marginTop: 10 }}>
			<Text style={{ fontWeight: 600 }}>{i!.name}</Text>
			<Spacer orientation='horizontal' grow />
			<Text color='rgb(96, 94, 92)' style={{ fontSize: 12 }}>
				{i!.value}
			</Text>
			<Spacer />
		</Stack>
	);
};

export interface IFileRow {
	key: string;
	name: string;
	value: string;
	iconName: string;
	fileType: string;
	fileSize: string;
	fileSizeRaw: number;
}

const fileColumns: IColumn[] = [
	{
		key: 'column1',
		name: 'File Type',
		className: ListClassNames.fileIconCell,
		iconClassName: ListClassNames.fileIconHeaderIcon,
		ariaLabel:
			'Column operations for File type, Press to sort on File type',
		iconName: 'Page',
		isIconOnly: true,
		fieldName: 'name',
		minWidth: 20,
		maxWidth: 20,
		onRender: (item: IFileRow) => {
			return (
				<img
					src={item.iconName}
					className={ListClassNames.fileIconImg}
					alt={item.fileType + ' file icon'}
				/>
			);
		},
	},
	{
		key: 'column2',
		name: 'Name',
		fieldName: 'name',
		minWidth: 210,
		maxWidth: 350,
		isRowHeader: true,
		isResizable: true,
		isSorted: true,
		isSortedDescending: false,
		sortAscendingAriaLabel: 'Sorted A to Z',
		sortDescendingAriaLabel: 'Sorted Z to A',
		data: 'string',
		isPadded: true,
	},
	{
		key: 'column3',
		name: 'File Size',
		fieldName: 'fileSizeRaw',
		minWidth: 70,
		maxWidth: 90,
		isResizable: true,
		isCollapsible: false,
		data: 'number',
		onRender: (item: IFileRow) => {
			return <span>{item.fileSize}</span>;
		},
	},
];

const files: IFileRow[] = [
	{
		key: faker.random.uuid(),
		name: faker.system.fileName(),
		value: faker.random.alpha(),
		iconName: faker.image.imageUrl(),
		fileType: faker.system.commonFileExt(),
		fileSize: `${faker.random.number(200)} KB`,
		fileSizeRaw: faker.random.number(200),
	},
	{
		key: faker.random.uuid(),
		name: faker.system.fileName(),
		value: faker.random.alpha(),
		iconName: faker.image.imageUrl(),
		fileType: faker.system.commonFileExt(),
		fileSize: `${faker.random.number(200)} KB`,
		fileSizeRaw: faker.random.number(200),
	},
	{
		key: faker.random.uuid(),
		name: faker.system.fileName(),
		value: faker.random.alpha(),
		iconName: faker.image.imageUrl(),
		fileType: faker.system.commonFileExt(),
		fileSize: `${faker.random.number(200)} KB`,
		fileSizeRaw: faker.random.number(200),
	},
];

const StackPanel = () => {
	const modalState = useStoreState(DataStore, (s) => s.Modals.StackPanel);
	const onDismissed = () => ModalService.closeFileModal();

	// Files in Stack state
	const [items, setItems] = useState<IFileRow[]>(files);
	const [columns, setColumns] = useState<IColumn[]>(fileColumns);
	const [selection, setSelection] = useState<IFileRow[]>([]);

	const numSelected =
		selection.length > 0 ? `${selection.length} files` : 'stack';
	const zeroOrOneSelected =
		selection.length == 0 || selection.length > 1 ? 'stack' : 'file';

	const menuItems: ICommandBarItemProps[] = [
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
			key: 'add',
			text: `Add files...`,
			onClick: () => console.log('add'),
			iconProps: { iconName: 'Add' },
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
			disabled: selection.length > 1,
			iconProps: { iconName: 'Edit' },
		},
	];

	return (
		<Panel
			onRenderHeader={() => {
				return (
					<>
						<Spacer orientation='horizontal' size={30} />

						<Text variant='xLarge'>
							<b>{modalState.stackId}</b> and 5 other files
						</Text>
						<Spacer grow />
					</>
				);
			}}
			type={PanelType.medium}
			isOpen={modalState.isOpen}
			onDismiss={onDismissed}
			isLightDismiss
		>
			<Spacer />
			<CommandBar
				style={{
					padding: 0,
					margin: 0,
					position: 'sticky',
					top: 0,
					zIndex: 100,
				}}
				styles={{ root: { paddingLeft: 0 } }}
				items={menuItems}
			/>
			{/* <PrimaryButton text='Transfer' iconProps={{ iconName: 'Send' }} />
			<Spacer orientation='horizontal' />
			<DefaultButton text='Share' iconProps={{ iconName: 'Share' }} /> */}

			<Spacer />
			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Files in stack</Text>
				</Separator>
				<FileList<IFileRow>
					items={items!}
					setItems={setItems}
					columns={columns!}
					setColumns={setColumns}
					selection={selection!}
					setSelection={setSelection}
				/>
			</Stack>

			<Spacer size={30} />

			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Details</Text>
				</Separator>
				<List
					style={{ marginLeft: 20 }}
					items={stackDetails}
					onRenderCell={onDetailRender}
				/>
			</Stack>

			<Spacer size={30} />

			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Activity</Text>
				</Separator>
			</Stack>
		</Panel>
	);
};
export default StackPanel;