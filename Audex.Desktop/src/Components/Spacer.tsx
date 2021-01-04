import React from 'react';

interface Props {
	size?: number;
	direction?: 'vertical' | 'horizontal';
}
const DEFAULT_SIZE = 20;

const Spacer = (props: Props) => {
	const d = props.direction ?? 'vertical';
	return (
		<div
			style={{
				width: d == 'horizontal' ? props.size ?? DEFAULT_SIZE : 0,
				height: d == 'vertical' ? props.size ?? DEFAULT_SIZE : 0,
			}}
		/>
	);
};

export default Spacer;
