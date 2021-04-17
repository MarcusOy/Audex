import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogFooter,
	PrimaryButton,
	DefaultButton,
	DialogType,
	TextField,
	Spinner,
	Text,
} from '@fluentui/react';
import { RENAME_FILE, RENAME_STACK } from '../../Data/Mutations';
import { useMutation } from '@apollo/client';
import Spacer from '../Spacer';
import { IFileRow } from '../Modals/StackPanel';
import { IStackRow } from '../StacksList';

interface Props {
	stack?: IStackRow;
	file?: IFileRow;
	visible: boolean;
	setVisible: React.Dispatch<boolean>;
}

const RenameDialog = (props: Props) => {
	const [newName, setNewName] = useState('');
	const [renameStack, stackRenameResult] = useMutation(RENAME_STACK);
	const [renameFile, fileRenameResult] = useMutation(RENAME_FILE);

	const loading = stackRenameResult.loading || fileRenameResult.loading;

	useEffect(() => setNewName(props.stack?.name ?? ''), [props.stack]);

	const onSubmit = () => {
		if (props.stack) {
			renameStack({
				variables: {
					stackId: props.stack.key,
					newName: newName,
				},
			}).then((d) => {
				if (d) props.setVisible(false);
			});
		} else if (props.file) {
			renameFile({
				variables: {
					fileId: props.file.key,
					newName: newName,
				},
			}).then((d) => {
				if (d) props.setVisible(false);
			});
		}
	};
	return (
		<Dialog
			hidden={!props.visible}
			onDismiss={() => props.setVisible(false)}
			type={DialogType.normal}
			title={`Rename ${props.stack ? 'stack' : 'file'}`}
		>
			<Text>
				Enter a new name for{' '}
				<em>{props.stack ? props.stack?.name : props.file?.name}</em>.
			</Text>
			<Spacer />
			<TextField
				placeholder={
					props.stack ? props.stack.noName : props.file?.name
				}
				defaultValue={props.stack?.rawName ?? ''}
				onChange={(_, n) => setNewName(n!)}
				onKeyDown={(e) => {
					if (e.key == 'Enter') onSubmit();
				}}
			/>
			<DialogFooter>
				<PrimaryButton
					disabled={loading}
					onClick={onSubmit}
					onRenderIcon={() => {
						return loading ? <Spinner /> : <></>;
					}}
					text='Submit'
				/>
				<DefaultButton
					onClick={() => props.setVisible(false)}
					text='Cancel'
				/>
				{/* {loading && <Spinner />} */}
			</DialogFooter>
		</Dialog>
	);
};

export default RenameDialog;
