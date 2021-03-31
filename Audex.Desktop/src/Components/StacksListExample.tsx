import * as React from 'react';
import {
	Announced,
	DetailsList,
	DetailsListLayoutMode,
	Selection,
	SelectionMode,
	IColumn,
	mergeStyleSets,
	TooltipHost,
	TooltipDelay,
	DirectionalHint,
} from '@fluentui/react';
import MenuBar from './MenuBar';
import ModalService from '../Data/Services/ModalService';
import faker from 'faker';

const classNames = mergeStyleSets({
	fileIconHeaderIcon: {
		padding: 0,
		fontSize: '16px',
	},
	fileIconCell: {
		textAlign: 'center',
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

export interface IDetailsListDocumentsExampleState {
	columns: IColumn[];
	items: IDocument[];
	selectionDetails: string;
	isModalSelection: boolean;
	isCompactMode: boolean;
	announcedMessage?: string;
}

export interface IDocument {
	key: string;
	name: string;
	value: string;
	iconName: string;
	fileType: string;
	modifiedBy: string;
	dateAdded: string;
	dateAddedValue: number;
	fileSize: string;
	fileSizeRaw: number;
}

export class DetailsListDocumentsExample extends React.Component<
	any,
	IDetailsListDocumentsExampleState
> {
	private _selection: Selection;
	private _allItems: IDocument[];

	constructor(props) {
		super(props);

		this._allItems = _generateDocuments();

		const columns: IColumn[] = [
			{
				key: 'column1',
				name: 'File Type',
				className: classNames.fileIconCell,
				iconClassName: classNames.fileIconHeaderIcon,
				ariaLabel:
					'Column operations for File type, Press to sort on File type',
				iconName: 'Page',
				isIconOnly: true,
				fieldName: 'name',
				minWidth: 20,
				maxWidth: 20,
				onColumnClick: this._onColumnClick,
				onRender: (item: IDocument) => {
					return (
						<TooltipHost
							tooltipProps={{
								onRenderContent: () => (
									<ol style={{ margin: 10, padding: 10 }}>
										<li>asdf.docx</li>
										<li>asdf.docx</li>
										<li>asdf.docx</li>
										<li>asdf.docx</li>
										<li>asdf.docx</li>
										<li>asdf.docx</li>
									</ol>
								),
							}}
							delay={TooltipDelay.zero}
							directionalHint={DirectionalHint.rightCenter}
						>
							{Array.from(new Array(3).fill(3).keys()).map(
								(i) => {
									return (
										<img
											key={faker.random.number()}
											src={item.iconName}
											className={classNames.fileIconImg}
											alt={item.fileType + ' file icon'}
											style={{
												position: 'relative',
												top: i,
												left: -12 * i,
												zIndex: 5 - i,
											}}
										/>
									);
								}
							)}
						</TooltipHost>
					);
				},
			},
			{
				key: 'column2',
				name: 'Name',
				fieldName: 'name',
				minWidth: 210,
				maxWidth: 350,
				isRowHeader: true,
				isResizable: true,
				isSorted: true,
				isSortedDescending: false,
				sortAscendingAriaLabel: 'Sorted A to Z',
				sortDescendingAriaLabel: 'Sorted Z to A',
				onColumnClick: this._onColumnClick,
				data: 'string',
				isPadded: true,
			},
			{
				key: 'column3',
				name: 'Date Added',
				fieldName: 'dateAddedValue',
				minWidth: 70,
				maxWidth: 90,
				isResizable: true,
				isCollapsible: true,
				onColumnClick: this._onColumnClick,
				data: 'number',
				onRender: (item: IDocument) => {
					return <span>{item.dateAdded}</span>;
				},
				isPadded: true,
			},
			{
				key: 'column4',
				name: 'Modified By',
				fieldName: 'modifiedBy',
				minWidth: 70,
				maxWidth: 90,
				isResizable: true,
				isCollapsible: true,
				data: 'string',
				onColumnClick: this._onColumnClick,
				onRender: (item: IDocument) => {
					return <span>{item.modifiedBy}</span>;
				},
				isPadded: true,
			},
			{
				key: 'column5',
				name: 'File Size',
				fieldName: 'fileSizeRaw',
				minWidth: 70,
				maxWidth: 90,
				isResizable: true,
				isCollapsible: false,
				data: 'number',
				onColumnClick: this._onColumnClick,
				onRender: (item: IDocument) => {
					return <span>{item.fileSize}</span>;
				},
			},
		];

		this._selection = new Selection({
			onSelectionChanged: () => {
				this.setState({
					selectionDetails: this._getSelectionDetails(),
				});
			},
		});

		this.state = {
			items: this._allItems,
			columns: columns,
			selectionDetails: this._getSelectionDetails(),
			isModalSelection: false,
			isCompactMode: false,
			announcedMessage: undefined,
		};
	}

	public render() {
		const {
			columns,
			items,
			selectionDetails,
			announcedMessage,
		} = this.state;

		return (
			<>
				<Announced message={selectionDetails} />
				{announcedMessage ? (
					<Announced message={announcedMessage} />
				) : undefined}
				{/* <MarqueeSelection
					selection={this._selection}
					style={{ marginLeft: 40, marginRight: 40 }}
				> */}
				<DetailsList
					items={items}
					columns={columns}
					selectionMode={SelectionMode.multiple}
					getKey={this._getKey}
					setKey='multiple'
					layoutMode={DetailsListLayoutMode.justified}
					isHeaderVisible={true}
					selection={this._selection}
					selectionPreservedOnEmptyClick={true}
					onItemInvoked={this._onItemInvoked}
					enterModalSelectionOnTouch={true}
					ariaLabelForSelectionColumn='Toggle selection'
					ariaLabelForSelectAllCheckbox='Toggle selection for all items'
					checkButtonAriaLabel='Row checkbox'
				/>
				{/* </MarqueeSelection> */}
			</>
		);
	}

	public componentDidUpdate(
		previousProps: any,
		previousState: IDetailsListDocumentsExampleState
	) {
		if (
			previousState.isModalSelection !== this.state.isModalSelection &&
			!this.state.isModalSelection
		) {
			this._selection.setAllSelected(false);
		}
	}

	private _getKey(item: any): string {
		return item.key;
	}

	private _onItemInvoked(item: IDocument): void {
		ModalService.openStackModal({ stackId: item.name });
	}

	private _getSelectionDetails(): string {
		const selectionCount = this._selection.getSelectedCount();

		switch (selectionCount) {
			case 0:
				return 'No items selected';
			case 1:
				return (
					'1 item selected: ' +
					(this._selection.getSelection()[0] as IDocument).name
				);
			default:
				return `${selectionCount} items selected`;
		}
	}

	private _onColumnClick = (
		ev: React.MouseEvent<HTMLElement>,
		column: IColumn
	): void => {
		const { columns, items } = this.state;
		const newColumns: IColumn[] = columns.slice();
		const currColumn: IColumn = newColumns.filter(
			(currCol) => column.key === currCol.key
		)[0];
		newColumns.forEach((newCol: IColumn) => {
			if (newCol === currColumn) {
				currColumn.isSortedDescending = !currColumn.isSortedDescending;
				currColumn.isSorted = true;
				this.setState({
					announcedMessage: `${currColumn.name} is sorted ${
						currColumn.isSortedDescending
							? 'descending'
							: 'ascending'
					}`,
				});
			} else {
				newCol.isSorted = false;
				newCol.isSortedDescending = true;
			}
		});
		const newItems = _copyAndSort(
			items,
			currColumn.fieldName!,
			currColumn.isSortedDescending
		);
		this.setState({
			columns: newColumns,
			items: newItems,
		});
	};
}

function _copyAndSort<T>(
	items: T[],
	columnKey: string,
	isSortedDescending?: boolean
): T[] {
	const key = columnKey as keyof T;
	return items
		.slice(0)
		.sort((a: T, b: T) =>
			(isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
		);
}

function _generateDocuments() {
	const items: IDocument[] = [];
	for (let i = 0; i < 500; i++) {
		const randomDate = _randomDate(new Date(2012, 0, 1), new Date());
		const randomFileSize = _randomFileSize();
		const randomFileType = _randomFileIcon();
		let fileName = _lorem(2);
		fileName =
			fileName.charAt(0).toUpperCase() +
			fileName.slice(1).concat(`.${randomFileType.docType}`);
		let userName = _lorem(2);
		userName = userName
			.split(' ')
			.map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
			.join(' ');
		items.push({
			key: i.toString(),
			name: fileName,
			value: fileName,
			iconName: randomFileType.url,
			fileType: randomFileType.docType,
			modifiedBy: userName,
			dateAdded: randomDate.dateFormatted,
			dateAddedValue: randomDate.value,
			fileSize: randomFileSize.value,
			fileSizeRaw: randomFileSize.rawSize,
		});
	}
	return items;
}

function _randomDate(
	start: Date,
	end: Date
): { value: number; dateFormatted: string } {
	const date: Date = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
	return {
		value: date.valueOf(),
		dateFormatted: date.toLocaleDateString(),
	};
}

const FILE_ICONS: { name: string }[] = [
	{ name: 'accdb' },
	{ name: 'audio' },
	{ name: 'code' },
	{ name: 'csv' },
	{ name: 'docx' },
	{ name: 'dotx' },
	{ name: 'mpp' },
	{ name: 'mpt' },
	{ name: 'model' },
	{ name: 'one' },
	{ name: 'onetoc' },
	{ name: 'potx' },
	{ name: 'ppsx' },
	{ name: 'pdf' },
	{ name: 'photo' },
	{ name: 'pptx' },
	{ name: 'presentation' },
	{ name: 'potx' },
	{ name: 'pub' },
	{ name: 'rtf' },
	{ name: 'spreadsheet' },
	{ name: 'txt' },
	{ name: 'vector' },
	{ name: 'vsdx' },
	{ name: 'vssx' },
	{ name: 'vstx' },
	{ name: 'xlsx' },
	{ name: 'xltx' },
	{ name: 'xsn' },
];

function _randomFileIcon(): { docType: string; url: string } {
	const docType: string =
		FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
	return {
		docType,
		url: `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`,
	};
}

function _randomFileSize(): { value: string; rawSize: number } {
	const fileSize: number = Math.floor(Math.random() * 100) + 30;
	return {
		value: `${fileSize} KB`,
		rawSize: fileSize,
	};
}

const LOREM_IPSUM = (
	'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
	'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
	'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
	'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt '
).split(' ');
let loremIndex = 0;
function _lorem(wordCount: number): string {
	const startIndex =
		loremIndex + wordCount > LOREM_IPSUM.length ? 0 : loremIndex;
	loremIndex = startIndex + wordCount;
	return LOREM_IPSUM.slice(startIndex, loremIndex).join(' ');
}

const StacksList = () => {
	return (
		<div>
			<MenuBar type='Files' />

			<DetailsListDocumentsExample />
		</div>
	);
};

export default StacksList;
