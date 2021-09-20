import { useMutation } from '@apollo/client';
import { IconButton } from '@fluentui/react';
import { Stack, ActivityItem, Link, Text } from '@fluentui/react';
import { formatDistance } from 'date-fns';
import React from 'react';
import { ACCEPT_TRANSFER, DECLINE_TRANSFER } from '../../Data/Mutations';
import DownloadService from '../../Data/Services/DownloadService';
import ModalService from '../../Data/Services/ModalService';
import FileIconStack from '../Icons/FileIconStack';
import Spacer from '../Spacer';
import { IIncomingTransferProps } from './IncomingTransfer';

const IncomingStackTransfer = (p: IIncomingTransferProps) => {
	const [acceptTransfer, acceptResult] = useMutation(ACCEPT_TRANSFER);
	const [declineTransfer, declineResult] = useMutation(DECLINE_TRANSFER);

	const stackName = `${p.transfer.stack.vanityName.name}${p.transfer.stack.vanityName.suffix}.`;

	const acceptHandler = () => {
		acceptTransfer({ variables: { transferId: p.transfer.id } }).then(
			(r) => {
				DownloadService.downloadFiles(
					(r.data.acceptTransfer as Array<any>).map((t) => t.id),
					stackName
				);
			}
		);
	};

	const loading = acceptResult.loading || declineResult.loading;

	return (
		<Stack horizontal>
			<ActivityItem
				activityIcon={
					<FileIconStack
						fileExtensions={p.transfer.stack.files
							.slice(0, 3)
							.map((f) => f.fileExtension)}
					/>
				}
				styles={{
					activityTypeIcon: {
						minWidth: 'fit-content',
					},
				}}
				activityDescription={[
					<Link style={{ fontWeight: 'bold' }} key={1}>
						{p.transfer.fromDevice.name}
					</Link>,
					<Text key={2}> would like to send you a stack named </Text>,
					<Link
						onClick={() =>
							ModalService.openStackModal({
								stackId: p.transfer.stack.id,
							})
						}
						style={{ fontWeight: 'bold' }}
						key={3}
					>
						{stackName}
					</Link>,
				]}
				timeStamp={
					<span>
						{formatDistance(
							new Date(p.transfer.createdOn),
							new Date()
						)}{' '}
						ago
					</span>
				}
			/>
			<Spacer grow orientation='horizontal' />
			<IconButton
				iconProps={{ iconName: 'CheckMark' }}
				disabled={loading}
				onClick={() => acceptHandler()}
			/>
			<IconButton
				iconProps={{ iconName: 'Cancel' }}
				disabled={loading}
				onClick={() =>
					declineTransfer({
						variables: { transferId: p.transfer.id },
					})
				}
			/>
		</Stack>
	);
};

export default IncomingStackTransfer;
