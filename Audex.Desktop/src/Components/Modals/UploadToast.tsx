import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { useMutation } from '@apollo/client';
import { useResettableMutation } from 'apollo-hooks-extended';
import {
	DefaultButton,
	IconButton,
	IMessageBarProps,
	MessageBar,
	MessageBarType,
	MotionTimings,
	Separator,
	Spinner,
	Stack,
	useTheme,
} from '@fluentui/react';
import { DataStore } from '../../Data/DataStore/DataStore';
import { CREATE_STACK, ENSURE_STACK } from '../../Data/Mutations';
import Spacer from '../Spacer';
import FileUnit from '../Uploading/FileUnit';
import { Console } from 'console';
import FileService from '../../Data/Services/FileService';
import { Animate } from 'react-simple-animate';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UploadToast = () => {
	const { palette } = useTheme();
	const [createStack, createResponse] = useResettableMutation(CREATE_STACK);
	const [ensureStack, ensureResponse] = useResettableMutation(ENSURE_STACK);
	const fileState = DataStore.useState((s) => s.Upload.Files);
	const uploadState = DataStore.useState((s) => s.Upload);

	const [isShown, setIsShown] = useState(true);

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

	const toastState =
		createResponse.error || ensureResponse.error
			? {
					icon: <FaTimesCircle color={palette.red} />,
					headerText: (
						<span>
							<b>Error creating new stack.</b>{' '}
							{createResponse.error?.message}{' '}
							{ensureResponse.error?.message}
						</span>
					),
			  }
			: isStackCreated && isDoneUploading
			? {
					icon: <FaCheckCircle size={40} color={palette.green} />,
					headerText: (
						<span>
							<b>Stack created.</b> To add more files to this
							stack, keep dropping files.
						</span>
					),
			  }
			: {
					icon: <Spinner />,
					headerText: <b>Creating new stack from dropped files...</b>,
			  };

	// const toastProps: IMessageBarProps = {
	// 	messageBarType:
	// 		createResponse.error || ensureResponse.error
	// 			? MessageBarType.error
	// 			: isStackCreated && isDoneUploading
	// 			? MessageBarType.success
	// 			: MessageBarType.info,
	// 	onDismiss: () => {
	// 		FileService.removeAllFiles();
	// 	},
	// };
	return (
		<>
			<Stack className={css(styles.container)}>
				<Animate
					play={isToastShowing}
					easeType={MotionTimings.decelerate}
					start={{
						opacity: 0,
						transform: 'translateY(48px)',
						pointerEvents: 'none',
					}}
					end={{
						opacity: 1,
						transform: 'translateY(0px)',
						pointerEvents: 'all',
					}}
				>
					<Stack className={css(styles.toast)}>
						<Stack
							horizontal
							horizontalAlign='center'
							tokens={{ childrenGap: 10 }}
						>
							{toastState.icon}
							{toastState.headerText}
							<IconButton
								iconProps={{
									iconName: isShown
										? 'ChevronUp'
										: 'ChevronDown',
								}}
								text='Show/Hide uploads'
								onClick={() => {
									setIsShown(!isShown);
								}}
							/>
							<IconButton
								iconProps={{ iconName: 'Cancel' }}
								text='Finish stack'
								onClick={() => FileService.removeAllFiles()}
							/>
						</Stack>
						<Animate
							play={isShown}
							easeType={MotionTimings.decelerate}
							start={{
								maxHeight: 0,
								opacity: 0,
								transform: 'translate3d(0, 48px, 0)',
								cursor: 'default',
							}}
							end={{
								maxHeight: 10000,
								opacity: 1,
								transform: 'translate3d(0, 0, 0)',
							}}
						>
							<Separator />
							<div className={css(styles.fileUnitsContainer)}>
								{fileState.map((f, i) => {
									return (
										<FileUnit
											key={i}
											fileIndex={i}
											file={f}
										/>
									);
								})}
							</div>
						</Animate>
						<Spacer />
					</Stack>
				</Animate>
			</Stack>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'fixed',
		// pointerEvents: 'none',
		width: '100%',
		bottom: 0,
	},
	toast: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 10,
		margin: '0 auto',

		background: 'white',
		opacity: 0.95,
		boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
		padding: 15,
		border: '1px solid #eee',
		borderRadius: 10,
		maxWidth: 400,
	},
	fileUnitsContainer: {
		overflowX: 'hidden',
		overflowY: 'visible',
		paddingLeft: 10,
		paddingRight: 10,
	},
});

export default UploadToast;
