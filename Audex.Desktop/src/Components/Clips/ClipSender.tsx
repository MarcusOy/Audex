import React, { useState } from 'react';
import { UploadToastStyles } from '../../Components/Modals/UploadToast';
import ClipsFeed from '../../Components/Clips/ClipsFeed';
import DevicesList from '../../Components/Devices/DevicesList';
import DevicesSelectionList from '../../Components/Devices/DevicesSelectionList';
import { css, StyleSheet } from 'aphrodite';
import Spacer from '../../Components/Spacer';
import {
	Text,
	Spinner,
	SpinnerSize,
	Stack,
	TextField,
	IconButton,
} from '@fluentui/react';
import ToastService, { TestInfo } from '../../Data/Services/ToastService';
import { useMutation } from '@apollo/client';
import { CREATE_AND_SEND_CLIP } from '../../Data/Mutations';

const ClipSender = () => {
	const [sendClip, { loading, error }] = useMutation(CREATE_AND_SEND_CLIP);
	const [selectedDevices, setSelectedDevies] = useState<string[]>([]);
	const [content, setContent] = useState('');
	const [isSecure, setIsSecure] = useState(false);

	const handleSendClip = () => {
		sendClip({
			variables: {
				content: content,
				isSecure: isSecure,
				transferTo: selectedDevices,
			},
		}).then(() => {
			setContent('');
			setSelectedDevies([]);
		});
	};

	const handleKeyPressSent = (
		e: React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === 'Enter' && e.shiftKey) {
			handleSendClip();
			e.preventDefault(); // prevents new line
			e.stopPropagation();
		}
	};

	const numberOfContentLines = Math.min(
		(content.match(/\n/g) || []).length,
		5
	);

	return (
		<Stack className={css(styles.clipSender)} style={{}} horizontal>
			<Stack
				style={{
					flex: '1 1 auto',
				}}
			>
				<textarea
					className={css(styles.textArea)}
					disabled={loading}
					style={{
						height: 20 + numberOfContentLines * 20 + 12 + 2,
					}}
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
					onKeyDown={handleKeyPressSent}
					placeholder='Start your clip here (shift-enter to send)...'
				/>
				<DevicesSelectionList
					selection={selectedDevices}
					setSelection={setSelectedDevies}
				/>
			</Stack>

			<Stack>
				<IconButton
					disabled={loading}
					iconProps={{ iconName: isSecure ? 'Lock' : 'Unlock' }}
					onClick={() => setIsSecure(!isSecure)}
				/>
				<Spacer grow />
				<IconButton
					disabled={loading}
					iconProps={{ iconName: 'Send' }}
					onClick={handleSendClip}
				/>
			</Stack>
		</Stack>
	);
};

const styles = StyleSheet.create({
	clipSender: {
		flex: '0 1 40px',
		background: 'white',
		opacity: 0.95,
		boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
		padding: 15,
		border: '1px solid #eee',
		borderRadius: 10,
		marginBottom: 10,
	},
	textArea: {
		font: 'inherit',
		border: 'none',
		overflow: 'auto',
		outline: 'none',
		resize: 'none',
	},
});

export default ClipSender;
