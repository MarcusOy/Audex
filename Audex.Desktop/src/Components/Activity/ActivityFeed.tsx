import {
	ActivityItem,
	Icon,
	IconButton,
	Link,
	Separator,
	Spinner,
	SpinnerSize,
	Stack,
	Text,
} from '@fluentui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';
import React, { useState } from 'react';
import faker from 'faker';
import MenuBar from '../MenuBar';
import ModalService from '../../Data/Services/ModalService';
import Spacer from '../Spacer';
import { DataStore } from '../../Data/DataStore/DataStore';
import FileIconStack from '../Icons/FileIconStack';
import { formatDistance } from 'date-fns';
import IncomingTransfer from './IncomingTransfer';
import IncomingTransfers from './IncomingTransfers';

const ActivityFeed = () => {
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
		// ModalService.openFileModal({ fileId: id });
	};

	return (
		<div>
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
				<Stack horizontal>
					<Text variant='large'>Transfers</Text>
					<Spacer grow orientation='horizontal' />
					<IconButton iconProps={{ iconName: 'DependencyAdd' }} />
					<IconButton iconProps={{ iconName: 'DependencyRemove' }} />
				</Stack>
				<Spacer />
				<IncomingTransfers />
				<Separator />
				<Stack horizontal>
					<Text variant='large'>Recent activity</Text>
					<Spacer grow orientation='horizontal' />
					<IconButton iconProps={{ iconName: 'Filter' }} />
				</Stack>
				<Spacer />
				{activity.map((i) => {
					return (
						<div key={i.key}>
							<Spacer />
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

export default ActivityFeed;
