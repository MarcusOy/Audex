import {
	DirectionalHint,
	Text,
	TooltipDelay,
	TooltipHost,
} from '@fluentui/react';
import faker from 'faker';
import React from 'react';
import { IStackRow } from '../../Pages/Tabs/StacksTab';
import FileIcon from './FileIcon';

interface IFileIconStackProps {
	stack: IStackRow;
}

const FileIconStack = (props: IFileIconStackProps) => {
	if (!props.stack) return <></>;
	return (
		<TooltipHost
			tooltipProps={{
				onRenderContent: () => (
					<Text variant='small'>{props.stack.files.join(', ')}</Text>
				),
			}}
			delay={TooltipDelay.zero}
			directionalHint={DirectionalHint.rightCenter}
		>
			{props.stack!.fileIcons.map((i, index) => {
				const isSingle = props.stack.fileIcons.length == 1;

				return (
					<FileIcon
						xs
						extension={i.split('.')[i.split('.').length - 1]}
						key={faker.random.number()}
						style={{
							position: 'relative',
							left: !isSingle ? -13 * index + 3 : -3,
							transform: !isSingle
								? `rotate(${15 + -15 * index}deg)`
								: '',
							transformOrigin: 'bottom left',
							zIndex: 5 - index,
							verticalAlign: 'middle',
						}}
					/>
				);
			})}
		</TooltipHost>
	);
};

export default FileIconStack;
