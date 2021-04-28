import React from 'react';

interface IFileIconProps {
	extension: string;
	xs?: boolean;
	sm?: boolean;
	lg?: boolean;
	xl?: boolean;

	style?: React.CSSProperties;
}

const FileIcon = (props: IFileIconProps) => {
	const isSizeDefined = props.xs || props.sm || props.lg || props.xl;
	const className = `file-icon${
		isSizeDefined &&
		` file-icon-${
			props.xs
				? 'xs'
				: props.sm
				? 'sm'
				: props.lg
				? 'lg'
				: props.xl
				? 'xl'
				: 'invalid'
		}`
	}`;
	return (
		<div
			className={className}
			data-type={props.extension}
			style={props.style}
		/>
	);
};

export default FileIcon;
