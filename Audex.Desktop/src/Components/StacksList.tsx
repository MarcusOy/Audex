import React, { useEffect, useRef, useState } from 'react';
import {
	IColumn,
	TooltipHost,
	TooltipDelay,
	DirectionalHint,
	Spinner,
	CommandBar,
	ICommandBarItemProps,
	Text,
	Stack,
	Image,
	PrimaryButton,
	IButtonProps,
} from '@fluentui/react';
import { formatDistance } from 'date-fns';
import ModalService from '../Data/Services/ModalService';
import faker from 'faker';
import DetailedList, { ListClassNames } from './DetailedList';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { CREATE_STARTER_STACK } from '../Data/Mutations';
import { GET_STACKS } from '../Data/Queries';
import fileSize from 'filesize';
import ToastService, {
	TestBlocked,
	TestInfo,
} from '../Data/Services/ToastService';
import RenameDialog from './Dialogs/RenameDialog';
import DeleteDialog from './Dialogs/DeleteDialog';
import { ON_STACKS_UPDATE } from '../Data/Subscriptions';
import Spacer from './Spacer';

export interface IStackRow {
	key: string;
	rawName: string;
	name: string;
	nameComponent: React.ReactNode;
	noName: string;
	createdByDevice: string;
	createdOn: Date;
	files: string[];
	fileIcons: string[];
	fileSize: string;
	fileSizeRaw: number;
}

const stackColumns: IColumn[] = [
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
		minWidth: 25,
		maxWidth: 25,
		onRender: (item: IStackRow) => {
			return (
				<TooltipHost
					tooltipProps={{
						onRenderContent: () => (
							<Text variant='small'>{item.files.join(', ')}</Text>
						),
					}}
					delay={TooltipDelay.zero}
					directionalHint={DirectionalHint.rightCenter}
				>
					{item.fileIcons.map((i, index) => {
						return (
							<img
								key={faker.random.number()}
								src={faker.image.imageUrl()}
								className={ListClassNames.fileIconImg}
								alt={i + ' file icon'}
								style={{
									position: 'relative',
									top: i,
									left: -13 * index,
									transform: `rotate(${15 + -15 * index}deg)`,
									transformOrigin: 'bottom left',
									zIndex: 5 - index,
								}}
							/>
						);
					})}
				</TooltipHost>
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
		sortAscendingAriaLabel: 'Sorted A to Z',
		sortDescendingAriaLabel: 'Sorted Z to A',
		data: 'string',
		isPadded: true,
		onRender: (item: IStackRow) => {
			return item.nameComponent;
		},
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
		onRender: (item: IStackRow) => {
			return <span>{item.fileSize}</span>;
		},
	},
	{
		key: 'column4',
		name: 'Date Created',
		fieldName: 'createdOn',
		minWidth: 90,
		maxWidth: 150,
		isResizable: true,
		isSorted: true,
		isSortedDescending: true,
		sortAscendingAriaLabel: 'Sorted by oldest',
		sortDescendingAriaLabel: 'Sorted by latest',
		data: 'number',
		isPadded: true,
		onRender: (item: IStackRow) => {
			return (
				<span>{formatDistance(item.createdOn, new Date())} ago</span>
			);
		},
	},
	{
		key: 'column5',
		name: 'Created by',
		fieldName: 'createdByDevice',
		minWidth: 90,
		maxWidth: 150,
		isResizable: true,
		sortAscendingAriaLabel: 'Sorted A to Z',
		sortDescendingAriaLabel: 'Sorted Z to A',
		data: 'string',
		isPadded: true,
	},
];

export const makeStackNameComponent = (s: any) => {
	return (
		<>
			{s.name ? (
				<span style={{ fontWeight: 600 }}>{s.name}</span>
			) : (s.files as Array<any>).length != 0 ? (
				<span>
					<span style={{ fontWeight: 600 }}>{s.files[0].name}</span>{' '}
					{(s.files as Array<any>).length > 1
						? `and ${s.files.length - 1} other files`
						: `${s.files[0].name} by itself`}
				</span>
			) : (
				<span>Empty stack</span>
			)}
		</>
	);
};

export const makeStackName = (s: any) => {
	return (s.files as Array<any>).length > 1
		? `${s.files[0].name} and ${s.files.length - 1} other files`
		: (s.files as Array<any>).length == 1
		? `${s.files[0].name} by itself`
		: `Empty stack`;
};

const StacksList = () => {
	const { data, loading, error, refetch } = useQuery(GET_STACKS);
	const onStacksUpdate = useSubscription(ON_STACKS_UPDATE, {});
	const [createStarterStack, createStarterStackResponse] = useMutation(
		CREATE_STARTER_STACK
	);

	const [stacks, setStacks] = useState<IStackRow[]>([]);
	const [columns, setColumns] = useState(stackColumns);
	const [selectedStacks, setSelectedStacks] = useState<IStackRow[]>([]);

	const [isRenameVisible, setIsRenameVisible] = useState(false);
	const [isDeleteVisible, setIsDeleteVisible] = useState(false);

	const numSelected =
		selectedStacks.length > 1 ? `${selectedStacks.length} stacks` : 'stack';
	const zeroOrOneSelected =
		selectedStacks.length == 0 || selectedStacks.length > 1
			? 'stack'
			: 'file';

	useEffect(() => {
		refetch();
	}, [onStacksUpdate.data]);

	useEffect(() => {
		if (data) {
			const s: IStackRow[] = (data.stacks
				.nodes as Array<any>).map<IStackRow>((s) => {
				return {
					key: s.id,
					rawName: s.name,
					name: s.name ?? makeStackName(s),
					nameComponent: makeStackNameComponent(s),
					noName: makeStackName(s),
					createdByDevice: s.uploadedByDevice.name,
					createdOn: new Date(s.createdOn),
					files: (s.files as Array<any>).map<string>((f) => f.name),
					fileIcons: (s.files as Array<any>)
						.slice(0, 3)
						.map<string>((f) => f.fileExtension),
					fileSizeRaw: (s.files as Array<any>)
						.map<number>((f) => f.fileSize)
						.reduce((a, b) => a + b, 0),
					fileSize: fileSize(
						(s.files as Array<any>)
							.map<number>((f) => f.fileSize)
							.reduce((a, b) => a + b, 0)
					),
				};
			});
			setStacks(s);
			setSelectedStacks([]);
		}
	}, [data]);

	const menuItems: ICommandBarItemProps[] = [
		{
			key: 'new',
			text: 'New stack',
			iconProps: { iconName: 'Add' },
			subMenuProps: {
				items: [
					{
						key: 'newStack',
						text: 'Upload files...',
					},
					{
						key: 'webStack',
						text: 'Upload from web',
					},
					{
						key: 'requestStack',
						text: 'Request stack',
					},
				],
			},
		},
		{
			key: 'download',
			text: `Download ${numSelected}`,
			iconProps: { iconName: 'Download' },
			onClick: () => console.log('Download'),
			disabled: selectedStacks.length == 0,
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
			text: `Transfer ${numSelected}`,
			iconProps: { iconName: 'Send' },
			onClick: () => console.log('Transfer'),
			disabled: selectedStacks.length == 0,
			split: true,
		},
		{
			key: 'share',
			text: `Share ${numSelected}`,
			iconProps: { iconName: 'Share' },
			onClick: () => console.log('Share'),
			disabled: selectedStacks.length == 0,
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
			onClick: () => setIsDeleteVisible(true),
			disabled: selectedStacks.length == 0,
			iconProps: { iconName: 'Trash' },
		},
		{
			key: 'rename',
			text: `Rename stack...`,
			onClick: () => setIsRenameVisible(true),
			disabled: selectedStacks.length != 1,
			iconProps: { iconName: 'Edit' },
		},
	];

	const farItems: ICommandBarItemProps[] = [
		{
			key: 'refresh',
			text: 'Refresh',
			ariaLabel: 'Refresh',
			iconOnly: true,
			iconProps: { iconName: 'Refresh' },
			onClick: () => refetch(),
		},
		{
			key: 'trash',
			text: 'View Trash',
			ariaLabel: 'View Trash',
			iconOnly: true,
			iconProps: { iconName: 'RemoveFromTrash' },
			onClick: () => ToastService.push(TestBlocked()),
		},
	];

	if (loading) return <Spinner />;

	if (stacks.length <= 0)
		return (
			<Stack horizontalAlign='center'>
				<Stack horizontalAlign='center' style={{ maxWidth: 300 }}>
					<Image width={300} src='/images/empty.png' />
					<Text variant='xLarge'>No stacks.</Text>
					<Text>
						You currently have no stacks. Drag and drop some files
						on this window or click <b>New stack</b>.
					</Text>
					<Spacer />
					<PrimaryButton
						{...(menuItems[0] as IButtonProps)}
						menuProps={{
							...menuItems[0].subMenuProps,
							items: [
								{
									key: 'newStarterStack',
									text: 'Create starter stack',
									onClick: () => {
										createStarterStack();
									},
								},
								...menuItems[0].subMenuProps!.items,
							],
						}}
					/>
				</Stack>
			</Stack>
		);

	return (
		<div>
			<CommandBar
				style={{
					marginTop: 10,
					position: 'sticky',
					top: 0,
					zIndex: 100,
				}}
				items={menuItems}
				farItems={farItems}
				ariaLabel='Use left and right arrow keys to navigate between commands'
			/>
			{selectedStacks.length == 1 && (
				<>
					<RenameDialog
						stack={selectedStacks[0]}
						visible={isRenameVisible}
						setVisible={setIsRenameVisible}
					/>
				</>
			)}
			{selectedStacks.length > 0 && (
				<DeleteDialog
					stacks={selectedStacks}
					visible={isDeleteVisible}
					setVisible={setIsDeleteVisible}
				/>
			)}
			<DetailedList<IStackRow>
				items={stacks!}
				setItems={setStacks}
				columns={columns!}
				setColumns={setColumns}
				selection={selectedStacks!}
				setSelection={setSelectedStacks}
				invoke={(i: IStackRow) => {
					ModalService.openStackModal({ stackId: i.key });
				}}
			/>
		</div>
	);
};

export default StacksList;
