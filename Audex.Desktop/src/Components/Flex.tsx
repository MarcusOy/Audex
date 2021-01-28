import * as React from 'react';

interface Props {
	direction?: 'horizontal' | 'vertical';
	justifyContent?:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'space-between'
		| 'space-around'
		| 'space-evenly';
	alignItems?:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'stretch'
		| 'baseline'
		| undefined;

	children: React.ReactNode;
	style?: React.CSSProperties;
}

const Flex = (props: Props) => {
	return (
		<div
			style={{
				...props.style,
				display: 'flex',
				flex: 1,
				justifyContent: props.justifyContent,
				alignItems: props.alignItems,
				flexDirection:
					props.direction == 'horizontal' ? 'row' : 'column',
			}}
		>
			{props.children}
		</div>
	);
};

Flex.defaultProps = {
	direction: 'horizontal',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
};

export default Flex;
