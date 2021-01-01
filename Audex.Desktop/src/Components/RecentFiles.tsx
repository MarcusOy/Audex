import {
	ActivityItem,
	Icon,
	IconButton,
	Link,
	Spinner,
	SpinnerSize,
	Text,
} from '@fluentui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';
import BackToTop from 'react-back-to-top-button';
import React, { useState } from 'react';
import faker from 'faker';
import MenuBar from './MenuBar';
import { IFilePanel } from './FilePanel';
import { DataStore } from '../Stores/DataStore';

const RecentFiles = () => {
	const moreFakeRecent = () => {
		return new Array(50).fill(null).map(
			(e) =>
				(e = {
					key: faker.random.number(),
					activityDescription: [
						<Link style={{ fontWeight: 'bold' }} key={1}>
							{faker.name.firstName()}
						</Link>,
						<Text key={2}> uploaded </Text>,
						<Link
							onClick={() => inspectFile('file guid')}
							style={{ fontWeight: 'bold' }}
							key={3}
						>
							{faker.system.fileName()}
						</Link>,
					],
					activityIcon: (
						<Icon
							{...getFileTypeIconProps({
								extension: 'docx',
								size: 32,
								imageFileType: 'png',
							})}
						/>
					),
					timeStamp: 'yesterday',
				})
		);
	};
	const [activity, setActivity] = useState(moreFakeRecent());

	const fetchData = () => {
		setTimeout(() => setActivity(activity.concat(moreFakeRecent())), 2000);
	};

	// // File Panel
	// const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(
	// 	false
	// );
	// const [file]
	const inspectFile = (id: string) => {
		// DataStore.update((s) => {
		// 	(s.Modals.FilePanel.isOpen = true),
		// 		(s.Modals.FilePanel.fileId = id);
		// });
		DataStore.openModal<IFilePanel>((s) => s.Modals.FilePanel, {
			fileId: id,
		});
	};

	return (
		<div>
			<MenuBar type='Recent' />

			<InfiniteScroll
				dataLength={activity.length} //This is important field to render the next data
				next={fetchData}
				hasMore={true}
				loader={<Spinner size={SpinnerSize.large} />}
				endMessage={
					<p style={{ textAlign: 'center' }}>
						<b>Yay! You have seen it all</b>
					</p>
				}
				style={{
					overflow: 'visible',
				}}
			>
				{activity.map((i) => {
					return (
						<ActivityItem
							{...i}
							key={i.key}
							style={{
								marginTop: 20,
								marginLeft: 40,
								marginRight: 40,
							}}
						/>
					);
				})}
			</InfiniteScroll>
			<BackToTop showAt={100} speed={1500} easing='easeOutSine'>
				<IconButton
					iconProps={{ iconName: 'ChevronUp' }}
					title='BacktoTop'
					ariaLabel='BacktoTop'
				/>
			</BackToTop>
			{/* <FilePanel isOpen={isOpen} dismiss={dismissPanel} /> */}
		</div>
	);
};

export default RecentFiles;
