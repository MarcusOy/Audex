import React, { useEffect, useState } from 'react';

import {
	IconButton,
	mergeStyleSets,
	ProgressIndicator,
	Stack,
} from '@fluentui/react';
import filesize from 'filesize';
import useAxios from 'axios-hooks';
import { DataStore } from '../../Data/DataStore/DataStore';
import { useStoreState } from 'pullstate';
import FileService from '../../Data/Services/FileService';

export enum FileState {
	Uploading,
	Processing,
	Successful,
	Error,
}

export interface IFileUnit extends File {
	success: boolean;
}

interface Props {
	file: IFileUnit;
}

const FileUnit = (props: Props) => {
	const uploadState = useStoreState(DataStore, (s) => s.Upload);
	const authState = useStoreState(DataStore, (s) => s.Authentication);

	const [uid, setUid] = useState('');
	const [fileState, setFileState] = useState(FileState.Uploading);
	const [progress, setProgress] = useState(0);

	const formData = new FormData();
	formData.append('file', props.file, props.file.name);
	formData.append('deviceId', authState.deviceId);

	const [{ data, loading, error }, execute] = useAxios(
		{
			data: formData,
			method: 'POST',
			baseURL: 'http://localhost:5000/api/v1/',
			url: 'Upload',
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${authState.accessToken}`, // TODO: insert JWT token here
			},
			onUploadProgress: function (progressEvent) {
				setProgress(
					Math.round(progressEvent.loaded / progressEvent.total)
				);
			},
		},
		{ manual: true }
	);

	useEffect(() => {
		if (fileState != FileState.Successful) execute();
	}, []);

	useEffect(() => {
		if (data) {
			setUid(data.id);
			setFileState(FileState.Successful);
			setProgress(1);
		} else {
			setFileState(FileState.Uploading);
		}

		FileService.fileSuccess(uploadState.Files.indexOf(props.file));
	}, [data]);

	useEffect(() => {
		if (error) {
			console.log(error);
			setFileState(FileState.Error);
		}
	}, [error]);

	const removeFile = () => {
		FileService.removeFile(props.file);
	};

	const description =
		fileState == FileState.Uploading
			? `Uploading... ${filesize(
					props.file.size * progress
			  )} of ${filesize(props.file.size)} (${progress * 100}%)`
			: fileState == FileState.Error
			? `Error: ${error?.message}`
			: fileState == FileState.Processing
			? 'Processing file...'
			: `Uploaded: ${uid}`;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<div style={{ flexGrow: 1, whiteSpace: 'normal' }}>
				<ProgressIndicator
					key={props.file.name}
					label={props.file.name}
					description={description}
					percentComplete={
						fileState != FileState.Processing ? progress : undefined
					}
					className={
						mergeStyleSets({
							progressIndicator: {
								whiteSpace: 'normal',
								textOverflow: 'ellipse',
								width: 275, // TODO: change later
							},
						}).progressIndicator
					}
				/>
			</div>
			<IconButton
				iconProps={{ iconName: 'ChromeClose' }}
				title='Remove File'
				onClick={removeFile}
			/>
		</div>
	);
};

export default FileUnit;
