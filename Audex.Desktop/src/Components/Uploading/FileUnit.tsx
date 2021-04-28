import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { IconButton, ProgressIndicator, Text, useTheme } from '@fluentui/react';
import filesize from 'filesize';
import useAxios from 'axios-hooks';
import { DataStore } from '../../Data/DataStore/DataStore';
import { useStoreState } from 'pullstate';
import FileService from '../../Data/Services/FileService';
import { useMutation } from '@apollo/client';
import { UPLOAD_FILE } from '../../Data/Mutations';

export interface IFileUnit {
	success: boolean;
	sent: boolean;
	progress: number;
	uid?: string;
}

interface Props {
	file: File;
	fileIndex: number;
}

const FileUnit = (props: Props) => {
	const [uploadFile] = useMutation(UPLOAD_FILE);
	const uploadState = useStoreState(DataStore, (s) => s.Upload);
	const fileUnitState = useStoreState(
		DataStore,
		(s) => s.Upload.FileUnits[props.fileIndex]
	);
	const [isError, setIsError] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	// console.log(isError);
	let abort: any;
	const performUpload = () => {
		setIsError(false);
		console.log('uploading file...');
		uploadFile({
			variables: { file: props.file },
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: (ev: ProgressEvent) => {
						console.log(`file progress ${ev.loaded / ev.total}...`);
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
				FileService.fileProgress(props.fileIndex, 1);
				FileService.fileSuccess(
					uploadState.Files.indexOf(props.file),
					r.data.uploadFile
				);
			})
			.catch((e: Error) => {
				setError(e.message);
				setIsError(true);
			});

		FileService.fileSent(uploadState.Files.indexOf(props.file));
	};
	useEffect(() => {
		if (!fileUnitState.sent) performUpload();
		return function cleanup() {
			try {
				abort();
			} catch {
				console.log('Cleanup abort failed.');
			}
		};
	}, []);

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
		fileUnitState.success || fileUnitState.uid
			? `Uploaded: ${fileUnitState.uid}`
			: isError
			? `Error: ${error}`
			: `Uploading... ${filesize(
					props.file.size * fileUnitState.progress
			  )} of ${filesize(props.file.size)} (${
					fileUnitState.progress * 100
			  }%)`;

	const barColor =
		fileUnitState.success || fileUnitState.uid
			? useTheme().palette.green
			: isError
			? useTheme().palette.red
			: useTheme().palette.blue;

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
						fileUnitState.success || isError
							? 1
							: fileUnitState.sent
							? fileUnitState.progress
							: undefined
					}
					className={css(styles.progressIndicator)}
					styles={{
						progressBar: {
							backgroundColor: barColor,
						},
					}}
				/>
			</div>
			{isError ?? (
				<IconButton
					iconProps={{ iconName: 'Refresh' }}
					size={5}
					title={'Retry upload'}
					onClick={performUpload}
					styles={{ icon: { fontSize: 12 } }}
				/>
			)}
			<IconButton
				iconProps={{ iconName: 'ChromeClose' }}
				size={5}
				title={'Remove file'}
				onClick={removeFile}
				styles={{ icon: { fontSize: 12 } }}
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
			transform: 'translateX(calc(155px - 100%))',
		},
	},
});

export default FileUnit;
