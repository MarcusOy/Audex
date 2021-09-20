import { useMutation } from '@apollo/client';
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import React from 'react';
import { CREATE_STARTING_CLIP } from '../../Data/Mutations';
import { IClipRow } from '../../Pages/Tabs/ClipsTab';
import EmptyState from '../EmptyState';
import Spacer from '../Spacer';
import ClipsGroup from './ClipsGroup';

interface IClipsFeedProps {
	clips: IClipRow[];
}

const createClipGroups = (clips: IClipRow[]): IClipRow[][] => {
	const groups: IClipRow[][] = [];
	let currentGroup: IClipRow[] = [];

	// For each clip
	for (let x = 0; x < clips.length; x++) {
		const clip = clips[x];
		// If current group is empty, populate it with
		// first "leader" clip
		if (currentGroup.length == 0) {
			currentGroup.push(clip);
			continue;
		}

		// If leader clip and current clip were made
		// on the same day AND have the same device
		// author, add to the current group
		const date1 = new Date(currentGroup[0].createdOn).getDate();
		const date2 = new Date(clip.createdOn).getDate();
		const device1 = currentGroup[0].uploadedByDevice.id;
		const device2 = clip.uploadedByDevice.id;
		if (date1 == date2 && device1 == device2) {
			currentGroup.push(clip);
			continue;
		}

		// If these conditions fail, add current group
		// to list of groups, then clear current group
		groups.push(currentGroup);
		currentGroup = [clip];
	}

	// If current group is not empty, push to
	// list of groups
	if (currentGroup.length > 0) groups.push(currentGroup);

	return groups;
};

const ClipsFeed = (p: IClipsFeedProps) => {
	const [createStarterClip, { loading, error }] =
		useMutation(CREATE_STARTING_CLIP);

	if (p.clips.length <= 0)
		return (
			<EmptyState
				title='No clips.'
				description={
					<Text>
						You currently have no clips. Drag and drop some files on
						this window or click <b>Create starter clip</b>.
					</Text>
				}
				actions={
					<PrimaryButton
						text='Create starter clip'
						onClick={() => createStarterClip()}
					/>
				}
			/>
		);

	return (
		<Stack tokens={{ childrenGap: 10 }}>
			{createClipGroups(p.clips).map((g, i) => {
				return <ClipsGroup key={i} clips={g} />;
			})}
		</Stack>
	);
};

export default ClipsFeed;
