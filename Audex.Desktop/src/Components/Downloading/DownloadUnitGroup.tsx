import { IconButton } from '@fluentui/react';
import { Text, Stack, MotionTimings } from '@fluentui/react-internal';
import { StyleSheet, css } from 'aphrodite';
import React, { useEffect, useState } from 'react';
import { getFileExt, getFolderName } from '../../Data/Helpers';
import DownloadService, {
	IDownload,
} from '../../Data/Services/DownloadService';
import FileIconStack from '../Icons/FileIconStack';
import DownloadUnit from './DownloadUnit';
import { Animate } from 'react-simple-animate';

interface IDownloadUnitGroupProps {
	downloads: IDownload[];
}

const DownloadUnitGroup = (p: IDownloadUnitGroupProps) => {
	const [isShown, setIsShown] = useState(false);

	const completedDownloads = p.downloads.filter(
		(d) => d.progress == 1
	).length;
	const totalDownloads = p.downloads.length;
	const fileExtensions = p.downloads.slice(0, 3).map((d) => {
		return getFileExt(d.fileName);
	});

	return (
		<div>
			<Stack style={{ marginLeft: 10 }} horizontal verticalAlign='center'>
				<FileIconStack fileExtensions={fileExtensions} />
				<div style={{ minWidth: 0 }}>
					<Text block nowrap variant='mediumPlus'>
						{p.downloads[0].groupName}
					</Text>
					<Text block variant='smallPlus'>
						{completedDownloads}/{totalDownloads} downloads complete
					</Text>
				</div>
				<div
					style={{
						flexGrow: 1,
					}}
				/>
				<IconButton
					iconProps={{ iconName: 'FabricFolder' }}
					text='Show folder'
					onClick={() => {
						DownloadService.showDownload(
							getFolderName(p.downloads[0].fileName)
						);
					}}
				/>
				<IconButton
					iconProps={{
						iconName: isShown ? 'ChevronUp' : 'ChevronDown',
					}}
					text='Open group of downloads'
					onClick={() => {
						setIsShown(!isShown);
					}}
				/>
			</Stack>
			<Animate
				play={isShown}
				easeType={MotionTimings.decelerate}
				start={{
					maxHeight: 0,
					opacity: 0,
					transform: 'translate3d(0, -48px, 0)',
					pointerEvents: 'none',
					cursor: 'default',
				}}
				end={{
					maxHeight: 10000,
					opacity: 1,
					transform: 'translate3d(0, 0, 0)',
				}}
			>
				<div
					style={{
						marginTop: 10,
						marginLeft: 5,
						marginRight: 5,
						overflow: 'hidden',
						height: 'auto',
					}}
				>
					{p.downloads.map((d) => {
						return <DownloadUnit key={d.fileName} download={d} />;
					})}
				</div>
			</Animate>
		</div>
	);
};

export default DownloadUnitGroup;
