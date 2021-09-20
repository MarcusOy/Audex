import {
	Stack,
	Image,
	TooltipHost,
	Spinner,
	SpinnerSize,
	useTheme,
	Check,
	Icon,
	Persona,
	PersonaSize,
	PersonaPresence,
} from '@fluentui/react';
import React from 'react';
import useDeviceList from './useDeviceList';
import { StyleSheet, css } from 'aphrodite';
import { IDeviceIconProps } from './DeviceIcon';
import { relative } from 'path';

interface IDevicesSelectionListProps {
	selection: string[];
	setSelection: React.Dispatch<string[]>;
}

const DevicesSelectionList = (p: IDevicesSelectionListProps) => {
	const { isLoading, devices } = useDeviceList();
	const { palette } = useTheme();

	const onClick = (d: IDeviceIconProps) => {
		if (p.selection.includes(d.id)) {
			p.setSelection(p.selection.filter((i) => i != d.id));
			return;
		}

		p.setSelection([...p.selection, d.id]);
	};

	if (isLoading) return <Spinner size={SpinnerSize.small} />;
	return (
		<Stack
			horizontal
			tokens={{ childrenGap: 10 }}
			style={{
				padding: 5,
			}}
		>
			{devices.map((d, i) => {
				const isSelected = p.selection.includes(d.id);
				return (
					<TooltipHost key={i} content={`Transfer to ${d.name}`}>
						<Persona
							className={css(
								styles.icon,
								isSelected && styles.iconSelected
							)}
							styles={{ details: { display: 'none' } }}
							onClick={() => onClick(d)}
							imageUrl={`/images/devices/${d.type}.png`}
							size={PersonaSize.size32}
							presence={
								isSelected
									? PersonaPresence.online
									: PersonaPresence.none
							}
						/>
					</TooltipHost>
				);
			})}
		</Stack>
	);
};

const styles = StyleSheet.create({
	icon: {
		cursor: 'pointer',
		transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
	},
	iconSelected: {
		transform: 'translate(0, -2px);',
	},
});

export default DevicesSelectionList;
