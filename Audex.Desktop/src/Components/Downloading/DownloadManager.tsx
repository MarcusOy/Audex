import {
	Callout,
	CommandBarButton,
	IconButton,
	Stack,
	Text,
	useTheme,
} from '@fluentui/react';
import React, { useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import { DataStore } from '../../Data/DataStore/DataStore';
import EmptyState from '../EmptyState';
import DownloadService, {
	IDownload,
} from '../../Data/Services/DownloadService';
import NotificationBadge, { Effect } from 'react-notification-badge';
import DownloadUnitGroup from './DownloadUnitGroup';
import { groupBy } from '../../Data/Helpers';

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

	const downloadGroups: IDownload[][] = Object.values(
		groupBy(
			Array.from(downloadState.Downloads.entries()).map(([k, d]) => {
				return d;
			}),
			'groupId',
			false
		)
	);

	return (
		<>
			<IconButton
				id={buttonId}
				iconProps={{ iconName: 'Installation' }}
				onClick={openManager}
				text='View downloads'
			>
				<NotificationBadge
					count={downloadState.NewItems}
					effect={Effect.SCALE}
					style={{
						fontSize: 10,
						minWidth: 3,
						right: 0,
						backgroundColor: useTheme().palette.orangeLight,
					}}
				/>
			</IconButton>
			{isCalloutVisible && (
				<Callout
					style={{ maxWidth: 320, padding: '20px 24px' }}
					role='alertdialog'
					gapSpace={0}
					target={`#${buttonId}`}
					onDismiss={() => setIsCalloutVisible(false)}
					setInitialFocus
				>
					<Stack
						styles={{ root: { maxHeight: 450 } }}
						tokens={{ childrenGap: 25 }}
					>
						<Stack horizontal>
							<Text block variant='xLarge'>
								Downloads
							</Text>
							<div
								style={{
									flexGrow: 1,
								}}
							/>
							{downloadState.Downloads.size > 0 && (
								<IconButton
									iconProps={{ iconName: 'ChromeClose' }}
									text='Clear session downloads'
									onClick={() => {
										DownloadService.clearSessionDownloads();
									}}
								/>
							)}
						</Stack>
						{downloadState.Downloads.size > 0 ? (
							downloadGroups.map((d, i) => {
								return (
									<DownloadUnitGroup key={i} downloads={d} />
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
