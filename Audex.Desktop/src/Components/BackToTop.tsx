import {
	FontIcon,
	getTheme,
	IconButton,
	mergeStyleSets,
} from '@fluentui/react';
import BackToTopButton from 'react-back-to-top-button';
import React from 'react';

const BackToTop = () => {
	const { palette } = getTheme();

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		<BackToTopButton showAt={100} speed={1500} easing='easeOutSine'>
			<FontIcon
				className={
					mergeStyleSets({
						icon: {
							selectors: {
								'&:hover': {
									background: palette.neutralLight,
								},
							},
							cursor: 'pointer',
							padding: 5,
							color: palette.accent,
							fontSize: 16,
						},
					}).icon
				}
				iconName='ChevronUp'
			/>
		</BackToTopButton>
	);
};

export default BackToTop;
