import { Spinner, useTheme } from '@fluentui/react';
import { Stack, Text } from '@fluentui/react';
import React from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import IncomingTransfer from './IncomingTransfer';

const IncomingTransfers = () => {
	const { palette } = useTheme();
	const incomingTransfersState = DataStore.useState(
		(s) => s.Identity?.device.incomingTransfers
	);

	if (incomingTransfersState == undefined) return <Spinner />;

	if (incomingTransfersState.length <= 0)
		return (
			<Stack horizontalAlign='center'>
				<Text style={{ color: palette.neutralPrimaryAlt }}>
					You&apos;re all caught up!
				</Text>
			</Stack>
		);

	return (
		<Stack style={{ marginLeft: 20 }}>
			{incomingTransfersState.map((t) => (
				<IncomingTransfer key={t.id} {...t} />
			))}
		</Stack>
	);
};

export default IncomingTransfers;
