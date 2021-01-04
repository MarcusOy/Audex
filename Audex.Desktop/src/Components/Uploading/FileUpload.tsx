import { Stack, Label, DefaultButton } from '@fluentui/react';
import { useStoreState } from 'pullstate';
import React, { createRef } from 'react';
import { DataStore } from '../../Data/DataStore';
import Spacer from '../Spacer';
import FileUnit, { IFileUnit } from './FileUnit';

const FileUpload = () => {
	const uploadState = useStoreState(DataStore, (s) => s.Upload);
	const inputRef = createRef<HTMLInputElement>();

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = Array.from(e!.target!.files!) as Array<IFileUnit>;
		DataStore.update((s) => {
			const a: IFileUnit[] = new Array<IFileUnit>()
				.concat(uploadState.Files)
				.concat(f);
			s.Upload.Files = a;
			inputRef.current!.value = '';
		});
	};

	return (
		<Stack>
			<Label>Files</Label>
			{uploadState.Files.map((f) => {
				return <FileUnit key={f.name} file={f} />;
			})}
			<Spacer />
			<input
				id='file-upload'
				type='file'
				onChange={onFileChange}
				hidden
				multiple
				ref={inputRef}
			/>
			<DefaultButton
				text={
					uploadState.Files.length > 0
						? 'Add more files'
						: 'Add files'
				}
				onClick={() => {
					inputRef.current?.click();
				}}
			/>
		</Stack>
	);
};

export default FileUpload;
