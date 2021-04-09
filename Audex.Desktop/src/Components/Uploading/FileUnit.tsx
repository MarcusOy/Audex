import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { IconButton, ProgressIndicator, Text } from '@fluentui/react';
import filesize from 'filesize';
import useAxios from 'axios-hooks';
import { DataStore } from '../../Data/DataStore/DataStore';
import { useStoreState } from 'pullstate';
import FileService from '../../Data/Services/FileService';
import { useMutation } from '@apollo/client';
import { UPLOAD_FILE } from '../../Data/Mutations';

export enum FileState {
	Uploading,
	Processing,
	Successful,
	Error,
}

export interface IFileUnit {
	success: boolean;
	sent: boolean;
	progress: number;
	uid: string;
}

interface Props {
	file: File;
	fileIndex: number;
}

const FileUnit = (props: Props) => {
	// If the auth token expires, perform any query to refresh it
	const [uploadFile, { data, loading, error }] = useMutation(UPLOAD_FILE);
	const uploadState = useStoreState(DataStore, (s) => s.Upload);
	const fileUnitState = useStoreState(
		DataStore,
		(s) => s.Upload.FileUnits[props.fileIndex]
	);
	console.log(fileUnitState);

	// const [uid, setUid] = useState('');
	const [fileState, setFileState] = useState(FileState.Uploading);
	// const [progress, setProgress] = useState(0);

	let abort: any;
	useEffect(() => {
		if (!fileUnitState.sent) {
			console.log('uploading file...');
			uploadFile({
				variables: { file: props.file },
				context: {
					fetchOptions: {
						useUpload: true,
						onProgress: (ev: ProgressEvent) => {
							console.log(
								`file progress ${ev.loaded / ev.total}...`
							);
							FileService.fileProgress(
								props.fileIndex,
								Math.round(ev.loaded / ev.total)
							);
						},
						onAbortPossible: (abortHandler: any) => {
							abort = abortHandler;
						},
					},
				},
			})
				.then((r) => {
					console.log(`file uploaded ${r.data.uploadFile}.`);
					setFileState(FileState.Successful);
					FileService.fileProgress(props.fileIndex, 1);
					FileService.fileSuccess(
						uploadState.Files.indexOf(props.file),
						r.data.uploadFile
					);
				})
				.catch(() => {
					console.log('file error.');
					setFileState(FileState.Error);
				});

			FileService.fileSent(uploadState.Files.indexOf(props.file));
		}
		return function cleanup() {
			try {
				abort();
				console.log('Cleanup abort passed.');
			} catch {
				console.log('Cleanup abort failed.');
			}
		};
	}, []);

	// const formData = new FormData();
	// formData.append('file', props.file, props.file.name);
	// formData.append('deviceId', authState.deviceId);

	// // Using axios to upload the file instead of graphql
	// const [{ data, loading, error }, execute] = useAxios(
	// 	{
	// 		data: formData,
	// 		method: 'POST',
	// 		baseURL: 'http://localhost:5000/api/v1/',
	// 		url: 'Upload',
	// 		headers: {
	// 			'Content-Type': 'multipart/form-data',
	// 			Authorization: `Bearer ${authState.accessToken}`,
	// 		},
	// 		onUploadProgress: function (progressEvent) {
	// 			setProgress(
	// 				Math.round(progressEvent.loaded / progressEvent.total)
	// 			);
	// 		},
	// 	},
	// 	{ manual: true }
	// );

	// // Refresh token in order to be authed for upload
	// useEffect(() => {
	// 	if (fileState != FileState.Successful) {
	// 		// Refresh token before upload, see below
	// 		refreshToken();
	// 	}
	// }, []);

	// // When token gets refreshed, now try uploading file
	// useEffect(() => {
	// 	execute().catch((e) => {
	// 		console.log(`Upload error: ${e}`);
	// 	});
	// }, [refreshTokenResponse.data]);

	// Once file upload is complete (or is currently uploading)
	// useEffect(() => {
	// 	if (data) {
	// 		setUid(data.id);
	// 		setFileState(FileState.Successful);
	// 		setProgress(1);
	// 		FileService.fileSuccess(
	// 			uploadState.Files.indexOf(props.file),
	// 			data.id
	// 		);
	// 	} else {
	// 		setFileState(FileState.Uploading);
	// 	}
	// }, [data]);

	// // If uploading causes an error
	// useEffect(() => {
	// 	if (error) {
	// 		setFileState(FileState.Error);
	// 	}
	// }, [error]);

	const removeFile = () => {
		try {
			abort();
		} catch {
			console.log('File upload abortion not possible.');
		} finally {
			FileService.removeFile(props.fileIndex);
		}
	};

	const description =
		fileState == FileState.Uploading
			? `Uploading... ${filesize(
					props.file.size * fileUnitState.progress
			  )} of ${filesize(props.file.size)} (${
					fileUnitState.progress * 100
			  }%)`
			: fileState == FileState.Error
			? `Error: ${error?.message}`
			: fileState == FileState.Processing
			? 'Processing file...'
			: `Uploaded: ${fileUnitState.uid}`;

	return (
		<div className={css(styles.container)}>
			<div className={css(styles.progressIndicatorContainer)}>
				<ProgressIndicator
					key={props.file.name}
					label={
						<div className={css(styles.fileNameContainer)}>
							<Text
								className={css(styles.fileName, styles.hover)}
								variant='smallPlus'
							>
								{props.file.name}
							</Text>
						</div>
					}
					description={
						<Text variant='small'>
							{!fileUnitState.success ? description : ''}
						</Text>
					}
					percentComplete={
						!fileUnitState.success
							? 1
							: fileState != FileState.Processing
							? fileUnitState.progress
							: undefined
					}
					className={css(styles.progressIndicator)}
				/>
			</div>
			<IconButton
				iconProps={{ iconName: 'ChromeClose' }}
				size={10}
				title='Remove File'
				onClick={removeFile}
			/>
		</div>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressIndicatorContainer: {
		flexGrow: 1,
		whiteSpace: 'normal',
		maxWidth: '40ch',
	},
	progressIndicator: {
		whiteSpace: 'normal',
		textOverflow: 'ellipse',
	},
	fileNameContainer: {
		position: 'relative',
		maxWidth: '35ch',
		height: '2.5ch',
		textOverflow: 'hidden',
	},
	fileName: {
		position: 'absolute',
		whiteSpace: 'nowrap',
		transform: 'translateX(0)',
		transition: '1s',
	},
	hover: {
		':hover': {
			transform: 'translateX(calc(190px - 100%))',
		},
	},
});

export default FileUnit;
