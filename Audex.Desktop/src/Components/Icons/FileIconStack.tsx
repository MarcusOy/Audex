import {
	DirectionalHint,
	Text,
	TooltipDelay,
	TooltipHost,
} from '@fluentui/react';
import faker from 'faker';
import React from 'react';
import { getFileExt } from '../../Data/Helpers';
import { IStackRow } from '../../Pages/Tabs/StacksTab';
import FileIcon from './FileIcon';

interface IFileIconStackProps {
	stack?: IStackRow;
	fileExtensions?: string[];
}

const FileIconStack = (props: IFileIconStackProps) => {
	const exts: string[] | undefined =
		(props.stack && props.stack.fileIcons) ??
		props.fileExtensions ??
		undefined;
	if (exts == undefined) return <></>;
	return (
		<>
			{exts.map((i, index) => {
				const isSingle = exts.length == 1;

				return (
					<FileIcon
						xs
						extension={getFileExt(i)}
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
		</>
		// </TooltipHost>
	);
};

export default FileIconStack;
