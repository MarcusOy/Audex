import { FontIcon, IconButton, Stack, Text, useTheme } from '@fluentui/react';
import { IClipRow } from '../../Pages/Tabs/ClipsTab';
import { StyleSheet, css } from 'aphrodite';
import ClipService from '../../Data/Services/ClipService';
import ModalService from '../../Data/Services/ModalService';

interface IClipProps {
	clip: IClipRow;
}
const Clip = (p: IClipProps) => {
	const { palette } = useTheme();
	const handleOpenPanel = () => {
		ModalService.openClipModal({ clipId: p.clip.id });
	};
	const handleTransfer = () => {
		console.log('transfer');
	};
	const onClick = () => ClipService.copyClip(p.clip);

	return (
		<Stack
			style={{ position: 'relative' }}
			className={css(styles.clip)}
			horizontal
			verticalAlign='center'
		>
			<Stack className={css(styles.overlay)} horizontal>
				<div
					className={css(styles.tooltip)}
					style={{ backgroundColor: 'rgb(243, 242, 241)' }}
				>
					<IconButton
						iconProps={{ iconName: 'Info' }}
						onClick={handleOpenPanel}
					/>
					<IconButton
						iconProps={{ iconName: 'Send' }}
						onClick={handleTransfer}
					/>
				</div>
				<div
					className={css(styles.tooltipAfter)}
					onClick={onClick}
				></div>
			</Stack>
			<Text
				variant='smallPlus'
				style={{
					width: 65,
					flex: '0 0 65px',
					color: palette.neutralSecondary,
				}}
			>
				{new Date(p.clip.createdOn).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				})}
			</Text>
			<Text
				style={{
					flex: 1,
				}}
			>
				{p.clip.isSecured ? (
					<Stack horizontal>
						<FontIcon
							iconName='Lock'
							style={{
								fontSize: 15,
								lineHeight: 1.5,
								marginRight: 5,
							}}
						/>
						Click to copy this secured clip.
					</Stack>
				) : (
					p.clip.content
				)}
			</Text>
		</Stack>
	);
};

const styles = StyleSheet.create({
	clip: {
		padding: 5,
		borderRadius: 5,
		transition: 'all 0.3s ease-out',
		':hover': {
			backgroundColor: 'rgba(237, 235, 233, 0.5)',
			cursor: 'pointer',
		},
	},
	overlay: {
		position: 'absolute',
		display: 'flex',
		// pointerEvents: 'none',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		opacity: 0,
		transition: 'all 0.3s ease-out',
		':hover': {
			opacity: 1,
		},
	},
	tooltip: {
		flex: '0 0 65px',
		borderRadius: 5,
	},
	tooltipAfter: {
		flex: 1,
	},
});

export default Clip;
