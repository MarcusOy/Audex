import React, { useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import {
	DefaultButton,
	FontWeights,
	getTheme,
	IconButton,
	mergeStyleSets,
	Modal,
	PrimaryButton,
	Spinner,
	Stack,
} from '@fluentui/react';
import Spacer from '../Spacer';
import IdentityService from '../../Data/Services/IdentityService';
import { DataStore } from '../../Data/DataStore/DataStore';
import ServerService from '../../Data/Services/ServerService';

const OfflineModal = () => {
	const selectedServer = DataStore.useState(
		(s) => s.Servers.selectedServerHostname
	);
	const serverState = DataStore.useState((s) =>
		s.Servers.serverList.get(selectedServer)
	);
	const authState = DataStore.useState((s) => s.Authentication);

	const [isRetrying, setIsRetrying] = useState(false);

	const onRetry = () => {
		setIsRetrying(true);
		setTimeout(() => {
			ServerService.isSelectedServerUp();
			setIsRetrying(false);
		}, 2000);
	};

	const onLogOut = () => {
		IdentityService.logOut();
	};

	return (
		<Modal
			isOpen={!serverState!.isOnline && authState.isAuthenticated}
			isBlocking={true}
			// styles={{
			// 	root: {
			// 		zIndex: 100000000001,
			// 	},
			// }}
			containerClassName={contentStyles.container}
		>
			<div className={contentStyles.header}>
				<span>Unable to connect</span>
			</div>
			<div className={contentStyles.body}>
				<p>
					We&apos;re having trouble connecting to{' '}
					<b>{serverState!.hostName}</b>.
				</p>
				{/* <p>Retrying in x seconds...</p> */}
				<Spacer />
				<Stack horizontal>
					<PrimaryButton
						text='Retry'
						onClick={onRetry}
						onRenderIcon={() => {
							return isRetrying ? <Spinner /> : <></>;
						}}
						disabled={isRetrying}
					/>
					<Spacer orientation='horizontal' />
					<DefaultButton
						text='Log out'
						onClick={onLogOut}
						// disabled={disabled}
					/>
				</Stack>
			</div>
		</Modal>
	);
};

export default OfflineModal;

const theme = getTheme();
const contentStyles = mergeStyleSets({
	container: {
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'stretch',
		zIndex: 99999999999,
	},
	header: [
		theme.fonts.xLargePlus,
		{
			flex: '1 1 auto',
			borderTop: `4px solid ${theme.palette.red}`,
			color: theme.palette.neutralPrimary,
			display: 'flex',
			alignItems: 'center',
			fontWeight: FontWeights.semibold,
			padding: '12px 12px 14px 24px',
		},
	],
	body: {
		flex: '4 4 auto',
		padding: '0 24px 24px 24px',
		overflowY: 'hidden',
		selectors: {
			p: { margin: '14px 0' },
			'p:first-child': { marginTop: 0 },
			'p:last-child': { marginBottom: 0 },
		},
	},
});
