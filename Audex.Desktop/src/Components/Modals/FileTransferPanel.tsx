import * as React from 'react';
import {
	DefaultButton,
	PrimaryButton,
	Panel,
	IChoiceGroupOption,
	ChoiceGroup,
	Stack,
	Label,
	TooltipHost,
	Icon,
	Dialog,
	DialogFooter,
	DialogType,
	MaskedTextField,
	Dropdown,
	IDropdownOption,
} from '@fluentui/react';
import { useStoreState } from 'pullstate';
import { DataStore } from '../../Data/DataStore/DataStore';
import { IModal } from './Modals';
import { useState } from 'react';
import { useEffect } from 'react';
import Spacer from '../Spacer';
import FileUpload from '../Uploading/FileUpload';
import ModalService from '../../Data/Services/ModalService';

export interface IFileTransferPanel extends IModal {
	fileId?: string;
	mode: 'upload' | 'transfer' | 'share';
}

const buttonStyles = { root: { marginRight: 8 } };

const actions: IChoiceGroupOption[] = [
	{ key: 'upload', text: 'Upload', iconProps: { iconName: 'OpenFile' } },
	{
		key: 'transfer',
		text: 'Transfer',
		iconProps: { iconName: 'ChangeEntitlements' },
	},
	{ key: 'share', text: 'Share', iconProps: { iconName: 'Share' } },
];

const shareActions: IChoiceGroupOption[] = [
	{ key: 'link', text: 'Link', iconProps: { iconName: 'Link' } },
	{
		key: 'pin',
		text: 'PIN',
		iconProps: { iconName: 'PasswordField' },
	},
];

const expiryOptions: IDropdownOption[] = [
	{ key: 'min', text: '1 minute' },
	{ key: 'hour', text: '1 hour' },
	{ key: 'day', text: '1 day' },
	{ key: 'week', text: '1 week' },
	{ key: 'never', text: 'Never' },
	{ key: 'custom', text: 'Custom...' },
];

export const FileTransferPanel = () => {
	const modalState = useStoreState(DataStore, (s) => s.Modals.FileTransfer);
	const uploadState = useStoreState(DataStore, (s) => s.Upload);

	const [mode, setMode] = useState<'upload' | 'transfer' | 'share'>();
	useEffect(() => setMode(modalState.mode), [modalState.mode]);

	const onDismissed = (ev: any) => {
		ev.preventDefault();
		setIsDialogVisible(true);
	};

	const onConfirm = (ev: any) => {
		hideDialogAndPanel();
	};

	const isConfirmable =
		uploadState.Files.length > 0
			? uploadState.Files.filter((f) => !f.success).length <= 0
			: false;

	// Exit Dialog
	const [isDialogVisible, setIsDialogVisible] = React.useState(false);
	const hideDialog = React.useCallback(() => setIsDialogVisible(false), []);
	const hideDialogAndPanel = React.useCallback(() => {
		ModalService.closeFileTransferModal();
		setIsDialogVisible(false);
	}, []);

	// Upload

	// Transfer

	// Share
	const [shareMode, setShareMode] = useState<'link' | 'pin'>('link');

	return (
		<div>
			<Panel
				isOpen={modalState.isOpen}
				onDismiss={onDismissed}
				headerText='File Transfer'
				closeButtonAriaLabel='Close'
				onRenderFooterContent={() => {
					return (
						<div>
							<PrimaryButton
								onClick={onConfirm}
								styles={buttonStyles}
								disabled={!isConfirmable}
							>
								Confirm
							</PrimaryButton>
							<DefaultButton onClick={onDismissed}>
								Cancel
							</DefaultButton>
						</div>
					);
				}}
				isFooterAtBottom={true}
			>
				<FileUpload />
				<Spacer />
				<Stack>
					<Stack horizontal>
						<Label>Action</Label>
						<div style={{ flexGrow: 1 }} />
						<TooltipHost
							tooltipProps={{
								// eslint-disable-next-line react/display-name
								onRenderContent: () => (
									<>
										<p>
											Not sure which action to pick? Here
											is how they work:
										</p>
										<p>
											Upload - Uploaded files will be sent
											directly to your drive. You will
											choose a destination folder for all
											files.
										</p>
										<p>
											Transfer - Uploaded files will be
											send directly to selected users and
											devices. Files sent to another user
											will need to be accepted by that
											user.
										</p>
										<p>
											Share - Uploaded files will be
											available to external users via a
											link. A time to expire can also be
											set.
										</p>
									</>
								),
							}}
							id='action-help'
						>
							<Icon
								style={{
									fontSize: 24,
								}}
								iconName='StatusCircleQuestionMark'
							/>
						</TooltipHost>
					</Stack>

					<ChoiceGroup
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						onChange={(e, o) => setMode(o?.key)}
						selectedKey={mode}
						options={actions}
					/>
				</Stack>

				<Stack
					style={{
						display: mode == 'upload' ? 'block' : 'none',
					}}
				>
					<Spacer />
					<Label>Upload</Label>
				</Stack>

				<Stack
					style={{
						display: mode == 'transfer' ? 'block' : 'none',
					}}
				>
					<Spacer />
					<Label>Transfer</Label>
				</Stack>

				<Stack
					style={{
						display: mode == 'share' ? 'block' : 'none',
					}}
				>
					<Spacer />
					<Label>Share</Label>
					<ChoiceGroup
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						onChange={(e, o) => setShareMode(o?.key)}
						selectedKey={shareMode}
						options={shareActions}
					/>
					<Label>PIN</Label>
					<MaskedTextField required mask='9999' />
				</Stack>
				<Dropdown
					placeholder='Select an option'
					label='Expiry'
					options={expiryOptions}
				/>
			</Panel>
			<Dialog
				hidden={!isDialogVisible}
				onDismiss={hideDialog}
				dialogContentProps={{
					type: DialogType.normal,
					title: 'Are you sure you want to cancel the file transfer?',
					subText: 'All file progress will be lost.',
				}}
				modalProps={{
					isBlocking: true,
					styles: { main: { maxWidth: 450 } },
				}}
			>
				<DialogFooter>
					<PrimaryButton onClick={hideDialogAndPanel} text='Yes' />
					<DefaultButton onClick={hideDialog} text='No' />
				</DialogFooter>
			</Dialog>
		</div>
	);
};
