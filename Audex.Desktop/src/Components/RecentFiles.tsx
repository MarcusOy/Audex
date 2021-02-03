import {
	ActivityItem,
	Icon,
	Link,
	Separator,
	Spinner,
	SpinnerSize,
	Text,
} from '@fluentui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';
import React, { useState } from 'react';
import faker from 'faker';
import MenuBar from './MenuBar';
import ModalService from '../Data/Services/ModalService';

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
							onClick={() => inspectFile(faker.random.uuid())}
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
		ModalService.openFileModal({ fileId: id });
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
						<div key={i.key}>
							<Separator />
							<ActivityItem
								{...i}
								style={{
									// marginTop: 20,
									marginLeft: 40,
									marginRight: 40,
								}}
							/>
						</div>
					);
				})}
			</InfiniteScroll>
		</div>
	);
};

export default RecentFiles;
