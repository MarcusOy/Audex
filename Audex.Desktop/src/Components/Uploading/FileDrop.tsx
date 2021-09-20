import {
	FontIcon,
	MessageBarType,
	Stack,
	Text,
	useTheme,
} from '@fluentui/react';
import { css, StyleSheet } from 'aphrodite';
import React, { useState } from 'react';
import { FileDrop as FileDropZone } from 'react-file-drop';
import { DataStore } from '../../Data/DataStore/DataStore';
import FileService from '../../Data/Services/FileService';
import FileUnit, { IFileUnit } from './FileUnit';

interface Props {
	children: React.ReactNode;
}

const FileDrop = (props: Props) => {
	const [fileHover, setFileHover] = useState(false);

	const { palette } = useTheme();
	const styles = StyleSheet.create({
		fileDrop: {
			height: '100vh',
			width: '100vw',
		},
		fileTarget: {
			height: '100vh',
			width: '100vw',
		},
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: palette.blackTranslucent40,
			color: 'white',
			transition: 'opacity 0.5s ease-out',
			zIndex: 1000,
			pointerEvents: 'none',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			opacity: 0,
		},
		activeOverlay: {
			opacity: 1,
		},
	});
	return (
		<FileDropZone
			className={css(styles.fileDrop)}
			targetClassName={css(styles.fileTarget)}
			onDrop={(files) => {
				setFileHover(false);
				const f = Array.from(files) as Array<File>;
				FileService.addFiles(f);
			}}
			onDragOver={() => setFileHover(true)}
			onDragLeave={() => setFileHover(false)}
		>
			{props.children}
			<div
				className={css(
					styles.overlay,
					fileHover && styles.activeOverlay
				)}
			>
				<FontIcon
					style={{
						fontSize: 42,
					}}
					iconName='CloudUpload'
				/>
				<Text variant='xLarge'>Drop files here.</Text>
			</div>
		</FileDropZone>
	);
};

export default FileDrop;
