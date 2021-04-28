import {
	Announced,
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	mergeStyleSets,
	SelectionMode,
	Selection,
} from '@fluentui/react';
import React, { PropsWithChildren, useEffect, useState } from 'react';

export const ListClassNames = mergeStyleSets({
	fileIconHeaderIcon: {
		padding: 0,
		fontSize: '16px',
	},
	fileIconCell: {
		textAlign: 'center',
		overflow: 'visible !important',
		selectors: {
			'&:before': {
				content: '.',
				display: 'inline-block',
				verticalAlign: 'middle',
				height: '100%',
				width: '0px',
				visibility: 'hidden',
			},
		},
	},
	fileIconImg: {
		verticalAlign: 'middle',
		maxHeight: '16px',
		maxWidth: '16px',
	},
	controlWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	exampleToggle: {
		display: 'inline-block',
		marginBottom: '10px',
		marginRight: '30px',
	},
	selectionDetails: {
		marginBottom: '20px',
	},
});

interface Props<T> {
	items: T[];
	setItems: React.Dispatch<T[]>;

	columns: IColumn[];
	setColumns: React.Dispatch<IColumn[]>;

	selection: T[];
	setSelection: React.Dispatch<T[]>;

	invoke?: (o: any) => void;
	isMultipleSelectable?: boolean;
}

const getSelectionDetails = (selection: Selection) => {
	const selectionCount = selection.getSelectedCount();

	switch (selectionCount) {
		case 0:
			return 'No items selected';
		case 1:
			return (
				'1 item selected: ' + (selection.getSelection()[0] as any).name
			);
		default:
			return `${selectionCount} items selected`;
	}
};

const copyAndSort = <T,>(
	items: T[],
	columnKey: string,
	isSortedDescending?: boolean
) => {
	const key = columnKey as keyof T;
	return items
		.slice(0)
		.sort((a: T, b: T) =>
			(isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
		);
};

const DetailedList = <T,>(props: PropsWithChildren<Props<T>>) => {
	const [announcedMessage, setAnnouncedMessage] = useState<string>();
	const [selectionDetails, setSelectionDetails] = useState<string>();
	const [selection, _] = useState<Selection>(
		new Selection({
			onSelectionChanged: () => {
				setSelectionDetails(getSelectionDetails(selection));
				props.setSelection(selection.getSelection() as T[]);
			},
		})
	);

	// Reset selection when update happens
	// useEffect(() => {
	// 	console.log('Resetting selection...');
	// 	selection.setItems([]);
	// }, [props.items]);

	const onColumnClick = (
		ev?: React.MouseEvent<HTMLElement>,
		column?: IColumn
	): void => {
		const { columns, items } = props;
		const newColumns: IColumn[] = columns.slice();
		const currColumn: IColumn = newColumns.filter(
			(currCol) => column!.key === currCol.key
		)[0];
		newColumns.forEach((newCol: IColumn) => {
			if (newCol === currColumn) {
				currColumn.isSortedDescending = !currColumn.isSortedDescending;
				currColumn.isSorted = true;
				setAnnouncedMessage(
					`${currColumn.name} is sorted ${
						currColumn.isSortedDescending
							? 'descending'
							: 'ascending'
					}`
				);
			} else {
				newCol.isSorted = false;
				newCol.isSortedDescending = true;
			}
		});
		const newItems = copyAndSort(
			items,
			currColumn.fieldName!,
			currColumn.isSortedDescending
		);

		props.setColumns(newColumns);
		props.setItems(newItems);
	};

	return (
		<>
			<Announced message={selectionDetails} />
			{announcedMessage ? (
				<Announced message={announcedMessage} />
			) : undefined}
			{/* <MarqueeSelection
				selection={selection}
				style={{ marginLeft: 40, marginRight: 40 }}
			> */}
			<DetailsList
				items={props.items}
				columns={props.columns}
				selectionMode={SelectionMode.multiple}
				getKey={(item: any) => {
					return item.key;
				}}
				setKey='multiple'
				layoutMode={DetailsListLayoutMode.justified}
				isHeaderVisible={true}
				selection={selection}
				selectionPreservedOnEmptyClick={true}
				onItemInvoked={props.invoke}
				enterModalSelectionOnTouch={true}
				ariaLabelForSelectionColumn='Toggle selection'
				ariaLabelForSelectAllCheckbox='Toggle selection for all items'
				checkButtonAriaLabel='Row checkbox'
				onColumnHeaderClick={onColumnClick}
			/>
			{/* </MarqueeSelection> */}
		</>
	);
};

export default DetailedList;
