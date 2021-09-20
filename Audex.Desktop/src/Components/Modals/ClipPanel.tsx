/* eslint-disable react/display-name */
import {
	CommandBar,
	FontIcon,
	ICommandBarItemProps,
	List,
	Panel,
	PanelType,
	Separator,
	Spinner,
	Stack,
	Text,
} from '@fluentui/react';
import { StyleSheet, css } from 'aphrodite';
import { useStoreState } from 'pullstate';
import { useEffect, useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import ModalService from '../../Data/Services/ModalService';
import Spacer from '../Spacer';
import { IModal } from './Modals';
import { useLazyQuery } from '@apollo/client';
import { GET_CLIP } from '../../Data/Queries';
import { IClipRow } from '../../Pages/Tabs/ClipsTab';
import EmptyState from '../EmptyState';
import ClipService from '../../Data/Services/ClipService';

export interface IClipPanel extends IModal {
	clipId: string;
}

export interface IClipDetails {
	name: string;
	value: string;
}

const onDetailRender = (i: IClipDetails | undefined) => {
	return (
		<Stack horizontal style={{ marginTop: 10 }}>
			<Text style={{ fontWeight: 600 }}>{i!.name}</Text>
			<Spacer orientation='horizontal' grow />
			<Text color='rgb(96, 94, 92)' style={{ fontSize: 12 }}>
				{i!.value}
			</Text>
			<Spacer />
		</Stack>
	);
};

const ClipPanel = () => {
	const modalState = useStoreState(DataStore, (s) => s.Modals.ClipPanel);
	const onDismissed = () => ModalService.closeClipModal();

	const [clip, setClip] = useState<IClipRow>();
	const [clipDetails, setClipDetails] = useState<IClipDetails[]>([]);

	const [getClip, { data, loading, error }] = useLazyQuery(GET_CLIP, {
		variables: {
			clipId: modalState.clipId,
		},
		fetchPolicy: 'network-only',
	});

	// Refetch clip when the clip id changes
	// (lazily so that it doesn't fetch null)
	useEffect(() => {
		if (modalState.isOpen && modalState.clipId) {
			getClip({ variables: { clipId: modalState.clipId } });
		}
	}, [modalState.clipId]);

	// Sort out the data received from query
	useEffect(() => {
		if (data) {
			if (data.clips.nodes.length != 1) return;

			const c = data.clips.nodes[0];
			setClip(c);

			const ds: IClipDetails[] = [
				{
					name: 'Date created',
					value: new Date(c.createdOn).toLocaleString(),
				},
				{
					name: 'Created by',
					value: c.uploadedByDevice.name,
				},
				{
					name: 'Times copied',
					value: '253',
				},
				{
					name: 'Visibility',
					value: 'Public (with link)',
				},
			];
			setClipDetails(ds);
		}
	}, [data]);

	const menuItems: ICommandBarItemProps[] = [
		{
			key: 'transfer',
			text: 'Transfer clip',
			iconProps: { iconName: 'Send' },
			onClick: () => console.log('Transfer'),
			split: true,
		},
		{
			key: 'share',
			text: 'Share clip',
			iconProps: { iconName: 'Share' },
			onClick: () => console.log('Share'),
			subMenuProps: {
				items: [
					{
						key: 'link',
						text: 'Share as Link',
					},
					{
						key: 'pin',
						text: 'Share with PIN',
					},
				],
			},
		},
		{
			key: 'delete',
			text: `Delete clip...`,
			onClick: () => console.log('Delete'),
			iconProps: { iconName: 'Trash' },
		},
		{
			key: 'edit',
			text: `Edit clip...`,
			onClick: () => console.log('Edit'),
			iconProps: { iconName: 'Edit' },
		},
		{
			key: 'copyCipherText',
			text: `Copy ciphertext`,
			onClick: () => ClipService.copyClip(clip!, true),
			disabled: !clip?.isSecured,
			iconProps: { iconName: 'Encryption' },
		},
	];

	let content = (
		<>
			<Spacer />
			<CommandBar
				style={{
					padding: 0,
					margin: 0,
					position: 'sticky',
					top: 0,
					zIndex: 100,
				}}
				styles={{ root: { paddingLeft: 0 } }}
				items={menuItems}
			/>
			<Spacer />
			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Content</Text>
				</Separator>
				<Stack
					className={css(styles.clip)}
					onClick={() => ClipService.copyClip(clip!)}
				>
					{clip?.isSecured ? (
						<Stack horizontal>
							<FontIcon
								iconName='Lock'
								style={{
									fontSize: 15,
									lineHeight: 1.5,
									marginRight: 5,
								}}
							/>
							Click to copy this secured clip.
						</Stack>
					) : (
						clip?.content
					)}
				</Stack>
			</Stack>
			<Spacer size={20} />
			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Details</Text>
				</Separator>
				<List
					style={{ marginLeft: 20 }}
					items={clipDetails}
					onRenderCell={onDetailRender}
				/>
			</Stack>
			<Spacer size={30} />
			<Stack>
				<Separator alignContent='start'>
					<Text variant='large'>Activity</Text>
				</Separator>
			</Stack>
		</>
	);

	if (loading || error) content = <Spinner />;

	if (data && data.clips.nodes.length != 1)
		content = (
			<EmptyState
				title='Clip not found.'
				description={<Text>This clip does not exist.</Text>}
				image='/images/not-found.png'
			/>
		);

	return (
		<Panel
			onRenderHeader={() => {
				return (
					<>
						<Spacer orientation='horizontal' size={30} />
						<Text variant='xLarge'>
							{!loading && clip && (
								<span>
									{clip.isSecured && 'Secured '}Clip{' '}
									<span style={{ fontWeight: 400 }}>
										made on{' '}
										{new Date(
											clip.createdOn
										).toLocaleDateString()}
									</span>
								</span>
							)}
						</Text>
						<Spacer grow />
					</>
				);
			}}
			type={PanelType.medium}
			isOpen={modalState.isOpen}
			onDismiss={onDismissed}
			isLightDismiss
		>
			{content}
		</Panel>
	);
};

const styles = StyleSheet.create({
	clip: {
		marginLeft: 20,
		padding: 5,
		borderRadius: 5,
		transition: 'all 0.3s ease-out',
		':hover': {
			backgroundColor: 'rgba(237, 235, 233, 0.5)',
			cursor: 'pointer',
		},
	},
});

export default ClipPanel;
