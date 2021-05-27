import {
	Stack,
	ProgressIndicator,
	getTheme,
	IconButton,
} from '@fluentui/react';
import filesize from 'filesize';
import React from 'react';
import DownloadService, {
	IDownload,
} from '../../Data/Services/DownloadService';
import FileIcon from '../Icons/FileIcon';
import Spacer from '../Spacer';
import { getFileExt, getFileName } from '../../Data/Helpers';

interface IDownloadUnitProps {
	key: string;
	download: IDownload;
}

const DownloadUnit = (p: IDownloadUnitProps) => {
	const description = p.download.isDownloaded
		? `Completed - ${filesize(p.download.size)}`
		: p.download.isCanceled
		? `Canceled.`
		: `Downloading... ${filesize(
				p.download.size * p.download.progress
		  )} of ${filesize(p.download.size)} (${p.download.progress * 100}%)`;
	const file = getFileName(p.download.fileName);
	const ext = getFileExt(p.download.fileName);

	return (
		<Stack key={p.key} horizontal verticalAlign='center'>
			<div
				onClick={() => {
					DownloadService.showDownload(p.download.fileName);
				}}
			>
				<ProgressIndicator
					styles={{
						root: {
							width: 280,
							padding: 5,
							cursor: 'pointer',
							selectors: {
								'&:hover': {
									background: getTheme().palette.neutralLight,
								},
							},
						},
					}}
					label={
						<Stack horizontal>
							<FileIcon extension={ext} xs />
							<Spacer orientation='horizontal' />
							{file}
						</Stack>
					}
					description={description}
					percentComplete={p.download.progress}
				/>
			</div>
			{/* <IconButton
				iconProps={{
					iconName: 'FabricFolder',
				}}
				text='Show in folder'
				onClick={() => {
					DownloadService.showDownloadInFolder(p.download.fileName);
				}}
			/> */}
		</Stack>
	);
};

export default DownloadUnit;
