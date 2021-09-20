import { useMutation } from '@apollo/client';
import { FontIcon, IconButton } from '@fluentui/react';
import { Stack, ActivityItem, Link, Text } from '@fluentui/react';
import { formatDistance } from 'date-fns';
import React from 'react';
import { DISMISS_TRANFER } from '../../Data/Mutations';
import ClipService from '../../Data/Services/ClipService';
import ModalService from '../../Data/Services/ModalService';
import Spacer from '../Spacer';
import { IIncomingTransferProps } from './IncomingTransfer';

const IncomingClipTransfer = (p: IIncomingTransferProps) => {
	const [dismissTransfer, { data, loading, error }] =
		useMutation(DISMISS_TRANFER);

	const dismissHandler = (wasCopied: boolean) => {
		ClipService.copyClip(p.transfer.clip);
		dismissTransfer({
			variables: { transferId: p.transfer.id, didCopy: wasCopied },
		});
	};

	return (
		<Stack horizontal>
			<ActivityItem
				activityIcon={
					<FontIcon iconName='Attach' style={{ fontSize: 20 }} />
				}
				activityDescription={[
					<Link style={{ fontWeight: 'bold' }} key={1}>
						{p.transfer.fromDevice.name}
					</Link>,
					<Text key={2}> would like to send you a </Text>,
					<Link
						onClick={() =>
							ModalService.openClipModal({
								clipId: p.transfer.clip.id,
							})
						}
						style={{ fontWeight: 'bold' }}
						key={3}
					>
						{p.transfer.clip.isSecured && 'secured '}clip.
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
				iconProps={{ iconName: 'ClipboardSolid' }}
				disabled={loading}
				onClick={() => dismissHandler(true)}
			/>
			<IconButton
				iconProps={{ iconName: 'Cancel' }}
				disabled={loading}
				onClick={() => dismissHandler(false)}
			/>
		</Stack>
	);
};

export default IncomingClipTransfer;
