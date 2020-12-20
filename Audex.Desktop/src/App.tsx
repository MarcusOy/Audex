import * as React from 'react';
import {
	initializeIcons,
	Link,
	MessageBar,
	MessageBarButton,
	MessageBarType,
	PartialTheme,
	PrimaryButton,
	ProgressIndicator,
	ThemeProvider,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import Axios from 'axios';

const appTheme: PartialTheme = {
	palette: {
		themePrimary: '#2196F3',
		themeLighterAlt: '#01060a',
		themeLighter: '#051827',
		themeLight: '#0a2d49',
		themeTertiary: '#145991',
		themeSecondary: '#1e83d5',
		themeDarkAlt: '#379ff4',
		themeDark: '#55adf5',
		themeDarker: '#80c2f8',
		neutralLighterAlt: '#25313c',
		neutralLighter: '#2b3844',
		neutralLight: '#364351',
		neutralQuaternaryAlt: '#3c4a59',
		neutralQuaternary: '#42515f',
		neutralTertiaryAlt: '#5b6b7a',
		neutralTertiary: '#f8fafc',
		neutralSecondary: '#f9fafc',
		neutralPrimaryAlt: '#fafbfd',
		neutralPrimary: '#F5F7FA',
		neutralDark: '#fdfdfe',
		black: '#fefefe',
		white: '#1F2933',
	},
};

enum FileState {
	Empty,
	Uploading,
	Successful,
	Error,
}

const App = () => {
	initializeIcons();

	const [file, setFile] = useState<File>();
	const [progress, setProgress] = useState(0);
	const [fileState, setFileState] = useState<FileState>(FileState.Empty);
	const [errorMessage, setErrorMessage] = useState('');

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e!.target!.files![0];
		setFile(f);
	};

	useEffect(() => {
		if (file != undefined) uploadFile();
	}, [file]);

	const uploadFile = () => {
		setFileState(FileState.Uploading);

		const formData = new FormData();
		console.log(file);
		formData.append('files', file!, file?.name);
		Axios.post('http://localhost:5000/api/v1/Upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress: (progressEvent) => {
				const totalLength = progressEvent.lengthComputable
					? progressEvent.total
					: progressEvent.target.getResponseHeader(
							'content-length'
					  ) ||
					  progressEvent.target.getResponseHeader(
							'x-decompressed-content-length'
					  );
				console.log('onUploadProgress', totalLength);
				if (totalLength !== null) {
					setProgress(
						Math.round((progressEvent.loaded * 100) / totalLength)
					);
				}
			},
		})
			.then(() => {
				setFileState(FileState.Successful);
			})
			.catch((e) => {
				setFileState(FileState.Error);
				setErrorMessage(e.message);
			})
			.finally(() => {
				setProgress(0);
				setFile(undefined);
			});
	};

	const ErrorMessage = ({ message }: { message: string }) => (
		<MessageBar
			messageBarType={MessageBarType.error}
			isMultiline={false}
			onDismiss={() => setFileState(FileState.Empty)}
			dismissButtonAriaLabel='Close'
		>
			An error has occured: {message}.
			<Link href='www.bing.com' target='_blank'>
				Learn more
			</Link>
		</MessageBar>
	);

	const SuccessMessage = () => (
		<MessageBar
			// actions={
			// 	<div>
			// 		<MessageBarButton>Yes</MessageBarButton>
			// 		<MessageBarButton>No</MessageBarButton>
			// 	</div>
			// }
			onDismiss={() => setFileState(FileState.Empty)}
			messageBarType={MessageBarType.success}
			isMultiline={false}
		>
			File {file?.name} successfully uploaded.
			<Link href='www.bing.com' target='_blank'>
				Learn More
			</Link>
		</MessageBar>
	);

	return (
		// <ThemeProvider theme={appTheme}>
		<ThemeProvider>
			<div className='App'>
				<input
					id='file-upload'
					type='file'
					onChange={onFileChange}
					hidden
				/>
				<PrimaryButton
					text='Upload File'
					onClick={() => {
						setFileState(FileState.Empty);
						document.getElementById('file-upload')?.click();
					}}
				/>
				{fileState === FileState.Uploading ?? (
					<ProgressIndicator percentComplete={progress} />
				)}
				{fileState === FileState.Successful && <SuccessMessage />}
				{fileState === FileState.Error && (
					<ErrorMessage message={errorMessage} />
				)}
			</div>
		</ThemeProvider>
	);
};

export default App;
