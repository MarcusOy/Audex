import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { GET_CLIPS } from '../../Data/Queries';
import { ON_CLIPS_UPDATE } from '../../Data/Subscriptions';
import ClipsFeed from '../../Components/Clips/ClipsFeed';
import ClipSender from '../../Components/Clips/ClipSender';

import useRemoteView from '../../Hooks/useRemoteView';
// import InfiniteScroll from '../../Components/InfiniteScroll/index';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface IClipRow {
	id: string;
	createdOn: string;
	uploadedByDevice: {
		id: string;
		name: string;
		deviceType: {
			name: string;
		};
	};
	content: string;
	isSecured: boolean;
}

const ClipsTab = () => {
	const { dataset, loading, error, lastEvent, isMore, next } =
		useRemoteView<IClipRow>({
			query: GET_CLIPS,
			subscription: ON_CLIPS_UPDATE,
			queryOptions: {
				fetchPolicy: 'network-only',
			},
		});
	const scrollRef = useRef<HTMLDivElement>(null);
	const [lastScrollHeight, setLastScrollHeight] = useState(0);

	// Whenever scrollRef current changes, record scroll height
	// to aid in refetch scroll fix
	useEffect(() => {
		if (scrollRef.current)
			setLastScrollHeight(scrollRef.current.scrollHeight);
	}, [scrollRef.current, dataset]);

	// Scroll to certain positions depending on dataset change
	useEffect(() => {
		if (!scrollRef.current) return;

		const refetchScroll =
			-1 * (lastScrollHeight - scrollRef.current.offsetHeight);

		switch (lastEvent) {
			case 'firstFetch':
				scrollRef.current.scrollTo(0, 0);
				break;
			case 'nextFetch':
				scrollRef.current.scrollTo(0, refetchScroll);
				break;
			case 'rowAdd':
				if (scrollRef.current.scrollTop < -100)
					scrollRef.current.scrollTo(0, 0);
				break;
		}
	}, [dataset]);

	const clips = [...dataset].reverse();

	if (clips.length <= 0 && (loading || error))
		return <Spinner size={SpinnerSize.large} />;

	return (
		<Stack
			style={{
				display: 'flex',
				flexFlow: 'column',
				height: '100%',
				marginRight: 20,
				marginLeft: 20,
			}}
		>
			<div
				id={'ClipsScroll'}
				ref={scrollRef}
				style={{
					display: 'flex',
					flex: '1 1 auto',
					overflowY: 'scroll',
					flexDirection: 'column-reverse', // To start scroll on bottom
				}}
			>
				<InfiniteScroll
					scrollableTarget={'ClipsScroll'}
					dataLength={dataset.length}
					next={next}
					hasMore={isMore}
					loader={<Spinner style={{ overflow: 'hidden' }} />}
					endMessage={
						<p style={{ textAlign: 'center' }}>No more clips.</p>
					}
					style={{
						display: 'flex',
						flexDirection: 'column-reverse',
						overflow: 'visible',
					}} //To put endMessage and loader to the top.
					inverse
				>
					<ClipsFeed clips={clips} />
				</InfiniteScroll>
			</div>
			<ClipSender />
		</Stack>
	);
};

export default ClipsTab;
