import { useMutation } from '@apollo/client';
import {
	Callout,
	CommandBarButton,
	ICommandBarItemProps,
	IComponentAsProps,
	Link,
	SearchBox,
	Spinner,
	SpinnerSize,
	Stack,
	Text,
} from '@fluentui/react';
import React, { useState } from 'react';
import { TRANSFER_STACK } from '../../../Data/Mutations';
import ToastService, {
	ErrorToast,
	SuccessToast,
} from '../../../Data/Services/ToastService';
import { IStackRow } from '../../../Pages/Tabs/StacksTab';
import { useId } from '@fluentui/react-hooks';
import DevicesList from '../../Devices/DevicesList';

export interface ITransferCommandButtonProps
	extends IComponentAsProps<ICommandBarItemProps> {
	selectedStacks: IStackRow[];
}

const TransferCommandButton: React.FunctionComponent<ITransferCommandButtonProps> = (
	p: ITransferCommandButtonProps
) => {
	const targetButton = React.useRef<HTMLDivElement | null>(null);
	const ButtonComponent = p.defaultRender || CommandBarButton;

	const [isCalloutVisible, setIsCalloutVisible] = useState(false);
	const [searchText, setSearchText] = useState<string | undefined>('');
	const buttonId = useId('transfer-stack-button');

	const [transferStack, { loading }] = useMutation(TRANSFER_STACK);
	const transferStackHandler = (stackId: string, toDeviceId: string) => {
		transferStack({
			variables: {
				stackId: stackId,
				toDeviceId: toDeviceId,
			},
		})
			.then((r) => {
				ToastService.push(
					SuccessToast('Successfully transfered stack.'),
					4
				);
			})
			.catch((e: Error) => {
				ToastService.push(
					ErrorToast(
						`An error occurred while trying to transfer a stack: ${e.message}`
					),
					4
				);
			});
	};

	const numSelected =
		p.selectedStacks.length > 1
			? `${p.selectedStacks.length} stacks`
			: 'stack';

	return (
		<>
			<div ref={targetButton}>
				<ButtonComponent
					{...(p as any)}
					id={buttonId}
					text={`Transfer ${numSelected}`}
					iconProps={{ iconName: 'Send' }}
					onClick={() => setIsCalloutVisible(!isCalloutVisible)}
					disabled={p.selectedStacks.length == 0}
					onRenderIcon={
						loading
							? () => {
									return <Spinner size={SpinnerSize.small} />;
							  }
							: undefined
					}
					split={true}
				/>
			</div>
			{isCalloutVisible && (
				<Callout
					style={{ width: 250, padding: '20px 24px' }}
					role='alertdialog'
					gapSpace={0}
					target={`#${buttonId}`}
					onDismiss={() => setIsCalloutVisible(false)}
					setInitialFocus
				>
					<Stack tokens={{ childrenGap: 10 }}>
						<Text block variant='large'>
							Transfer to device
						</Text>
						<SearchBox
							placeholder='Filter'
							iconProps={{ iconName: 'Filter' }}
							onChange={(e, t) => setSearchText(t)}
						/>
						<DevicesList
							hideAddButton
							hideCurrentDevice
							searchText={searchText}
						/>
						<Text variant='smallPlus'>
							Click on one of your devices to create a transfer
							request.{' '}
							<Link href='http://microsoft.com' target='_blank'>
								Learn more
							</Link>
						</Text>
					</Stack>
				</Callout>
			)}
		</>
	);
};

export default TransferCommandButton;
