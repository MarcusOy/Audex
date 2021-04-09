import React, { useEffect } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { useMutation } from '@apollo/client';
import { useResettableMutation } from 'apollo-hooks-extended';
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { DataStore } from '../../Data/DataStore/DataStore';
import { CREATE_STACK, ENSURE_STACK } from '../../Data/Mutations';
import Spacer from '../Spacer';
import FileUnit from '../Uploading/FileUnit';
import faker from 'faker';

const UploadToast = () => {
	const [createStack, createResponse] = useResettableMutation(CREATE_STACK);
	const [ensureStack, ensureResponse] = useResettableMutation(ENSURE_STACK);
	const fileState = DataStore.useState((s) => s.Upload.Files);
	const uploadState = DataStore.useState((s) => s.Upload);

	const isToastShowing = uploadState.Files.length > 0;
	const isDoneUploading =
		uploadState.Files.length > 0
			? uploadState.FileUnits.filter(
					(f) => !f.success && f.uid == undefined
			  ).length <= 0
			: false;
	const isStackCreated = uploadState.CurrentStackContext != '';

	// Set stack context so that user can perform actions on the stack
	useEffect(() => {
		if (createResponse.data)
			DataStore.update((s) => {
				s.Upload.CurrentStackContext = createResponse.data.id;
			});
	}, [createResponse.data]);

	// Determine if to create stack or add to stack when files are added
	useEffect(() => {
		// if (isDoneUploading) {
		// 	if (isStackCreated) {
		// 		ensureStack({
		// 			variables: {
		// 				stackId: uploadState.CurrentStackContext,
		// 				fileIds: uploadState.Files.map((f) => f.uid),
		// 			},
		// 		});
		// 		return;
		// 	}
		// 	createStack({
		// 		variables: {
		// 			fileIds: uploadState.Files.map((f) => f.uid),
		// 		},
		// 	});
		// }
	}, [uploadState.Files]);

	const toastProps = {
		messageBarType:
			createResponse.error || ensureResponse.error
				? MessageBarType.error
				: isStackCreated
				? MessageBarType.success
				: MessageBarType.info,
		children: (
			<>
				{createResponse.error || ensureResponse.error ? (
					<b>Error creating new stack.</b>
				) : isStackCreated ? (
					<b>Stack created.</b>
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
			</>
		),
	};
	console.log(uploadState);
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
