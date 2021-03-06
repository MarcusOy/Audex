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
	FontIcon,
	SpinnerSize,
} from '@fluentui/react';
import { formatDistance } from 'date-fns';
import ModalService from '../../Data/Services/ModalService';
import DetailedList, { ListClassNames } from '../../Components/DetailedList';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
	CREATE_STARTER_STACK,
	GET_DOWNLOAD_TOKENS_FOR_STACK,
} from '../../Data/Mutations';
import { GET_STACKS } from '../../Data/Queries';
import fileSize from 'filesize';
import ToastService, {
	ErrorToast,
	TestBlocked,
} from '../../Data/Services/ToastService';
import RenameDialog from '../../Components/Dialogs/RenameDialog';
import DeleteDialog from '../../Components/Dialogs/DeleteDialog';
import { ON_STACKS_UPDATE } from '../../Data/Subscriptions';
import Spacer from '../../Components/Spacer';
import DevicesList from '../../Components/DevicesList';
import FileUpload, {
	FileUploadHandle,
} from '../../Components/Uploading/FileUpload';
import FileIconStack from '../../Components/Icons/FileIconStack';
import DownloadService from '../../Data/Services/DownloadService';
import EmptyState from '../../Components/EmptyState';

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
		minWidth: 20,
		maxWidth: 20,
		onRender: (item: IStackRow) => {
			return <FileIconStack stack={item} />;
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
						: ` by itself`}
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

const StacksTab = () => {
	const { data, loading, error, refetch } = useQuery(GET_STACKS);
	const onStacksUpdate = useSubscription(ON_STACKS_UPDATE, {});
	const [createStarterStack, createStarterStackResponse] = useMutation(
		CREATE_STARTER_STACK
	);

	const [stacks, setStacks] = useState<IStackRow[]>([]);
	const [columns, setColumns] = useState(stackColumns);
	const [selectedStacks, setSelectedStacks] = useState<IStackRow[]>([]);

	const uploadRef = useRef<FileUploadHandle>(null);
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

	const [getDownloadTokens, getDownloadTokensResponse] = useMutation(
		GET_DOWNLOAD_TOKENS_FOR_STACK
	);

	const getDownloadTokensHandler = () => {
		getDownloadTokens({
			variables: {
				stackId: selectedStacks[0].key,
			},
		})
			.then((r) => {
				const urls = (r.data.downloadTokensForStack as Array<any>).map(
					(t) => t.id
				);
				DownloadService.downloadFiles(urls, selectedStacks[0].name);
			})
			.catch((e: Error) => {
				ToastService.push(
					ErrorToast(
						`An error occurred while trying to download: ${e.message}`
					),
					4
				);
			});
	};

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
						onClick: () => {
							uploadRef.current?.openDialog();
						},
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
			onRenderIcon: getDownloadTokensResponse.loading
				? () => {
						return <Spinner size={SpinnerSize.small} />;
				  }
				: undefined,
			onClick: getDownloadTokensHandler,
			disabled:
				getDownloadTokensResponse.loading || selectedStacks.length == 0,
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

	let content = (
		<>
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
			<FileUpload ref={uploadRef} />
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
		</>
	);

	if (loading)
		content = (
			<>
				<Spacer />
				<Spinner />
			</>
		);

	if (!loading && stacks.length <= 0)
		content = (
			<EmptyState
				title='No stacks.'
				description={
					<Text>
						You currently have no stacks. Drag and drop some files
						on this window or click <b>New stack</b>.
					</Text>
				}
				actions={
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
				}
				maxWidth={300}
			/>
		);

	return (
		<div>
			<DevicesList />
			{content}
		</div>
	);
};

export default StacksTab;
