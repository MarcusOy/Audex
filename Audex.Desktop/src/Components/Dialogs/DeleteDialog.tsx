import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogFooter,
	DefaultButton,
	DialogType,
	Spinner,
	Text,
} from '@fluentui/react';
import { DELETE_FILE, DELETE_STACK } from '../../Data/Mutations';
import { useMutation } from '@apollo/client';
import Spacer from '../Spacer';
import { IFileRow } from '../Modals/StackPanel';
import { IStackRow } from '../../Pages/Tabs/StacksTab';

interface Props {
	stacks?: IStackRow[];
	files?: IFileRow[];
	visible: boolean;
	setVisible: React.Dispatch<boolean>;
}

const DeleteDialog = (props: Props) => {
	const [deleteStack, stackDeleteResult] = useMutation(DELETE_STACK);
	const [deleteFile, fileDeleteResult] = useMutation(DELETE_FILE);

	const loading = stackDeleteResult.loading || fileDeleteResult.loading;

	const objectType = props.stacks
		? props.stacks.length > 1
			? 'stacks'
			: 'stack'
		: props.files
		? props.files.length > 1
			? 'files'
			: 'file'
		: '';

	const onSubmit = () => {
		if (props.stacks) {
			deleteStack({
				variables: {
					stackIds: props.stacks.map((s) => {
						return s.key;
					}),
				},
			}).then((d) => {
				if (d) props.setVisible(false);
			});
		} else if (props.files) {
			deleteFile({
				variables: {
					fileIds: props.files.map((s) => {
						return s.key;
					}),
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
			dialogContentProps={{ type: DialogType.normal }}
			title={`Delete ${objectType}`}
		>
			<Text>
				Are you sure you want to delete the selected {objectType}?
			</Text>
			<Spacer />
			<DialogFooter>
				<DefaultButton
					text='Delete'
					style={{ backgroundColor: '#f00', color: 'white' }}
					disabled={loading}
					onRenderIcon={() => {
						return loading ? <Spinner /> : <></>;
					}}
					onClick={onSubmit}
				/>
				<DefaultButton
					onClick={() => props.setVisible(false)}
					text='Cancel'
				/>
			</DialogFooter>
		</Dialog>
	);
};

export default DeleteDialog;
