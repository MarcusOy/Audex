// Taken from https://github.com/garth/react-hooks-responsive
// and modified. Thank you @Garth!

import { useState, useEffect } from 'react';

export type Orientation = 'landscape' | 'portrait';

export interface Screen<T> {
	size: keyof T;
	orientation: Orientation;
	screenIsAtLeast(breakpoint: keyof T, andOrientation?: Orientation): boolean;
	screenIsAtMost(breakpoint: keyof T, andOrientation?: Orientation): boolean;
}

interface ResponsiveConfig {
	[name: string]: number;
}

const useResponsive = (
	breakpoints: ResponsiveConfig = {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	}
): Screen<ResponsiveConfig> => {
	const sizes = Object.entries(breakpoints).sort(
		([a, aSize], [b, bSize]) => bSize - aSize
	);
	if (sizes[sizes.length - 1][1] !== 0) {
		console.warn(
			'fixing',
			sizes[sizes.length - 1][0],
			'size which should be 0'
		);
		sizes[sizes.length - 1][1] = 0;
	}

	const getScreen = (): Screen<ResponsiveConfig> => {
		const width = window.innerWidth;
		const size = sizes.find(([_, size]) => size < width)![0];
		const orientation =
			width > window.innerHeight ? 'landscape' : 'portrait';
		return {
			size,
			orientation,
			screenIsAtLeast(breakpoint, andOrientation) {
				return (
					width >= breakpoints[breakpoint] &&
					(!andOrientation || andOrientation === orientation)
				);
			},
			screenIsAtMost(breakpoint, andOrientation) {
				return (
					width <= breakpoints[breakpoint] &&
					(!andOrientation || andOrientation === orientation)
				);
			},
		};
	};

	const [screen, setScreen] = useState(getScreen());

	useEffect(() => {
		const onResize = () => {
			const current = getScreen();

			if (
				current.size !== screen.size ||
				current.orientation !== screen.orientation
			) {
				setScreen(current);
			}
		};

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, [screen, setScreen, getScreen]);

	return screen;
};

export default useResponsive;
