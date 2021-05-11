import {
	Callout,
	CommandBarButton,
	IconButton,
	ProgressIndicator,
	Stack,
	Text,
} from '@fluentui/react';
import React, { useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import { DataStore } from '../../Data/DataStore/DataStore';
import EmptyState from '../EmptyState';
import DownloadService from '../../Data/Services/DownloadService';
import NotificationBadge, { Effect } from 'react-notification-badge';

const DownloadManager = () => {
	const downloadState = DataStore.useState((s) => s.Download);
	const [isCalloutVisible, setIsCalloutVisible] = useState(false);
	const buttonId = useId('download-manager-button');

	const openDownloadsFolder = () => {
		DownloadService.openDownloadsFolder();
	};
	const openManager = () => {
		setTimeout(() => {
			DownloadService.dismissNewItems();
		}, 500);

		setIsCalloutVisible(!isCalloutVisible);
	};

	return (
		<>
			<IconButton
				id={buttonId}
				iconProps={{ iconName: 'Installation' }}
				onClick={openManager}
			>
				<NotificationBadge
					count={downloadState.NewItems}
					effect={Effect.SCALE}
					style={{ fontSize: 10, minWidth: 3, right: 0 }}
				/>
			</IconButton>
			{isCalloutVisible && (
				<Callout
					style={{ width: 320, padding: '20px 24px' }}
					role='alertdialog'
					gapSpace={0}
					target={`#${buttonId}`}
					onDismiss={() => setIsCalloutVisible(false)}
					setInitialFocus
				>
					<Stack tokens={{ childrenGap: 10 }}>
						<Text block variant='xLarge'>
							Downloads
						</Text>
						{downloadState.Downloads.length > 0 ? (
							downloadState.Downloads.map((d, i) => {
								return (
									<ProgressIndicator
										key={i}
										label='Example title'
										description='Example description'
										// percentComplete={percentComplete}
									/>
								);
							})
						) : (
							<EmptyState
								title='No downloads.'
								description='No files have been downloaded in this session. Try downloading some stacks or files.'
								image='/images/no-downloads.png'
							/>
						)}
						<CommandBarButton
							iconProps={{ iconName: 'Forward' }}
							style={{
								height: 30,
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							text='Open downloads folder'
							onClick={openDownloadsFolder}
						/>
					</Stack>
				</Callout>
			)}
		</>
	);
};

export default DownloadManager;
