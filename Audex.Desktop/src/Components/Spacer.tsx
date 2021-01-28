import * as React from 'react';

/**
 *
 *
 * @interface Props
 */
interface Props {
	/**
	 * Indicates the size of the spacer
	 *
	 * @type {number}
	 * @memberof Props
	 */
	size: number;
	/**
	 * Decides whether the spacer has a height or a width
	 *
	 * @type {('vertical' | 'horizontal')}
	 * @memberof Props
	 */
	orientation?: 'vertical' | 'horizontal';

	/**
	 * Ignores size prop and uses flexGrow instead
	 *
	 * @type {boolean}
	 * @memberof Props
	 */
	grow?: boolean;
}

const Spacer = (props: Props) => {
	return (
		<div
			style={{
				flexGrow: props.grow ? 1 : 0,
				width:
					props.orientation == 'horizontal' && !props.grow
						? props.size
						: 0,
				height:
					props.orientation == 'vertical' && !props.grow
						? props.size
						: 0,
			}}
		/>
	);
};

Spacer.defaultProps = {
	size: 10,
	orientation: 'vertical',
};

export default Spacer;
