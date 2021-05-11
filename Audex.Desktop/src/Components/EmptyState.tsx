import { PrimaryButton, Stack, Image, Text } from '@fluentui/react';
import React from 'react';
import Spacer from './Spacer';

interface IEmptyStateProps {
	title: string | React.ReactNode;
	description: string | React.ReactNode;

	image?: string;
	maxWidth?: number;
	actions?: React.ReactNode;
}

const EmptyState = (props: IEmptyStateProps) => {
	return (
		<Stack horizontalAlign='center'>
			<Stack
				horizontalAlign='center'
				style={{ maxWidth: props.maxWidth ?? 300 }}
			>
				<Image width={300} src={props.image ?? '/images/empty.png'} />
				{typeof props.title == typeof '' ? (
					<Text variant='xLarge'>{props.title}</Text>
				) : (
					props.title
				)}
				{typeof props.description == typeof '' ? (
					<Text>{props.description}</Text>
				) : (
					props.description
				)}
				<Spacer />
				{props.actions}
			</Stack>
		</Stack>
	);
};

export default EmptyState;
