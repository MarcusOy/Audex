import { Image, Stack, Text, useTheme } from '@fluentui/react';
import { IClipRow } from '../../Pages/Tabs/ClipsTab';
import { StyleSheet, css } from 'aphrodite';
import Spacer from '../Spacer';
import { format, isToday, isYesterday } from 'date-fns';
import Clip from './Clip';

function formatDate(d: Date) {
	if (isToday(d)) {
		return `Today`;
	}

	if (isYesterday(d)) {
		return `Yesterday`;
	}

	return format(d, 'E, MMMM co, yyyy ');
}

interface IClipsGroupProps {
	clips: IClipRow[];
}

const ClipsGroup = (p: IClipsGroupProps) => {
	const { palette } = useTheme();

	if (p.clips.length <= 0) return <></>;
	const device = p.clips[0].uploadedByDevice;

	return (
		<Stack className={css(styles.clipGroup)}>
			<Stack className={css(styles.clipHeader)} horizontal>
				<Image
					width={20}
					height={20}
					style={{
						borderRadius: 20,
					}}
					src={`/images/devices/${device.deviceType.name}.png`}
				/>
				<Spacer size={5} orientation='horizontal' />
				<Text>
					<b style={{ fontWeight: 600 }}>{device.name}</b> clipped
				</Text>
				<Spacer orientation='horizontal' grow />
				<Text
					variant='smallPlus'
					style={{ color: palette.neutralSecondary }}
				>
					{formatDate(new Date(p.clips[0].createdOn))}
				</Text>
			</Stack>
			<Spacer />
			{p.clips.map((c, i) => {
				return <Clip key={i} clip={c} />;
			})}
		</Stack>
	);
};

const styles = StyleSheet.create({
	clipGroup: {
		width: '100%',
		padding: 10,
		position: 'relative',
	},
	clipHeader: {
		backgroundColor: 'white',
		position: 'sticky',
		zIndex: 1,
		top: 0,
	},
	clip: {
		padding: 5,
		borderRadius: 5,
		transition: 'background-color 0.3s ease-out',
		':hover': {
			backgroundColor: 'rgba(237, 235, 233, 0.5)',
			cursor: 'pointer',
		},
	},
});

export default ClipsGroup;
