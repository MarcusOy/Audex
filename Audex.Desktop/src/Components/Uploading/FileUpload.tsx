import { Stack, Label, DefaultButton } from '@fluentui/react';
import { useStoreState } from 'pullstate';
import React, { createRef, forwardRef, useImperativeHandle } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import FileService from '../../Data/Services/FileService';
import Spacer from '../Spacer';
import FileUnit, { IFileUnit } from './FileUnit';

interface FileUploadProps {
	children?: React.ReactNode;
}
export interface FileUploadHandle {
	openDialog: () => void;
}

const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>((_, ref) => {
	const uploadState = useStoreState(DataStore, (s) => s.Upload);
	const inputRef = createRef<HTMLInputElement>();

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = Array.from(e!.target!.files!) as Array<File>;
		FileService.addFiles(f);
		inputRef.current!.value = '';
	};

	useImperativeHandle(ref, () => {
		return {
			openDialog() {
				inputRef.current?.click();
			},
		};
	});

	return (
		<input
			id='file-upload'
			type='file'
			onChange={onFileChange}
			hidden
			multiple
			ref={inputRef}
		/>
	);
});

export default FileUpload;
