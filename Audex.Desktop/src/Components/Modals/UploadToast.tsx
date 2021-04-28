import React, { useEffect } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { useMutation } from '@apollo/client';
import { useResettableMutation } from 'apollo-hooks-extended';
import {
	DefaultButton,
	IMessageBarProps,
	MessageBar,
	MessageBarType,
	Stack,
} from '@fluentui/react';
import { DataStore } from '../../Data/DataStore/DataStore';
import { CREATE_STACK, ENSURE_STACK } from '../../Data/Mutations';
import Spacer from '../Spacer';
import FileUnit from '../Uploading/FileUnit';
import faker from 'faker';
import { Console } from 'console';
import FileService from '../../Data/Services/FileService';

const UploadToast = () => {
	const [createStack, createResponse] = useResettableMutation(CREATE_STACK);
	const [ensureStack, ensureResponse] = useResettableMutation(ENSURE_STACK);
	const fileState = DataStore.useState((s) => s.Upload.Files);
	const uploadState = DataStore.useState((s) => s.Upload);

	const isToastShowing = uploadState.Files.length > 0;
	const isDoneUploading =
		uploadState.Files.length > 0
			? uploadState.FileUnits.filter(
					(f) => !f.success || f.uid == undefined
			  ).length <= 0
			: false;
	const isStackCreated = uploadState.CurrentStackContext != undefined;

	// Determine if to create stack or add to stack when files are added
	useEffect(() => {
		if (uploadState.FileUnits.length > 0) {
			if (isDoneUploading) {
				if (isStackCreated) {
					// Add file node ids to current stack context
					ensureStack({
						variables: {
							stackId: uploadState.CurrentStackContext,
							fileIds: uploadState.FileUnits.map((f) => f.uid),
						},
					}).then((r) => {
						console.log(
							`Stack ensured: ${r.data.ensureInStack.id}`
						);
					});
					return;
				}
				createStack({
					variables: {
						fileIds: uploadState.FileUnits.map((f) => f.uid),
					},
				}).then((r) => {
					// Set stack context so that user can perform actions on the stack
					console.log(`Stack Created: ${r.data.id}`);
					DataStore.update((s) => {
						s.Upload.CurrentStackContext = r.data.createStack.id;
					});
				});
			}
			return;
		}
		FileService.removeAllFiles();
	}, [uploadState.FileUnits]);

	const toastProps: IMessageBarProps = {
		messageBarType:
			createResponse.error || ensureResponse.error
				? MessageBarType.error
				: isStackCreated && isDoneUploading
				? MessageBarType.success
				: MessageBarType.info,
		onDismiss: () => {
			FileService.removeAllFiles();
		},
		children: (
			<Stack>
				{createResponse.error || ensureResponse.error ? (
					<span>
						<b>Error creating new stack.</b>{' '}
						{createResponse.error?.message}
						{ensureResponse.error?.message}
					</span>
				) : isStackCreated ? (
					<span>
						<b>Stack created.</b> To add more files to this stack,
						keep dropping files.
					</span>
				) : (
					<b>Creating new stack from dropped files...</b>
				)}
				<Spacer />
				<div className={css(styles.fileUnitsContainer)}>
					{fileState.map((f, i) => {
						return (
							<FileUnit
								key={f.name + faker.random.alphaNumeric()}
								fileIndex={i}
								file={f}
							/>
						);
					})}
				</div>
				<Spacer />
				<Stack horizontal>
					{isStackCreated ? (
						<>
							<Stack.Item grow>
								<DefaultButton
									text='Transfer'
									iconProps={{ iconName: 'Send' }}
								/>
							</Stack.Item>
							<Stack.Item grow>
								<DefaultButton
									text='Share'
									iconProps={{ iconName: 'Share' }}
								/>
							</Stack.Item>
						</>
					) : (
						<></>
					)}
				</Stack>
			</Stack>
		),
	};
	return (
		<>
			{isToastShowing ? (
				<Stack>
					<Spacer />
					<MessageBar
						styles={{
							root: {
								opacity: 0.95,
								boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
								borderRadius: 10,
								width: 300,
							},
						}}
						{...toastProps}
						// onDismiss={() => onDismiss(t.key as string)}
					/>
				</Stack>
			) : (
				<></>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	fileUnitsContainer: {
		maxHeight: '14rem',
		overflowX: 'hidden',
		overflowY: 'scroll',
	},
});

export default UploadToast;
