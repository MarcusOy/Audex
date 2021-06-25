import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Dialog,
	DialogFooter,
	DialogType,
	IDropdownOption,
	Link,
	MessageBar,
	MessageBarType,
	PrimaryButton,
	Spinner,
	SpinnerSize,
	Stack,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import { EDIT_DEVICE } from '../../Data/Mutations';
import FormTextBox from '../Forms/FormTextBox';
import FormDropdown from '../Forms/FormDropdown';
import { GET_DEVICE_TYPES } from '../../Data/Queries';
import Form from '../Forms/Form';
import EditDeviceIcon from '../Devices/EditDeviceIcon';
import { getOS } from '../../Data/Helpers';

interface FormFields {
	name: string;
	deviceType: string;
}

const DeviceSetupModal = () => {
	// States
	const isFirstTimeSetup = DataStore.useState(
		(s) => s.Identity?.device.isFirstTimeSetup
	);
	const [deviceTypes, setDeviceTypes] = useState<IDropdownOption[]>([]);
	const platform = getOS();

	// GraphQL hooks
	const { data, loading: dtLoading, error: dtError } = useQuery(
		GET_DEVICE_TYPES
	);
	const [setupDevice, { loading, error }] = useMutation(EDIT_DEVICE);

	// Get DeviceTypes
	useEffect(() => {
		if (data && data.deviceTypes.nodes) {
			const enums: IDropdownOption[] = [];
			(data.deviceTypes.nodes as Array<any>).map((e) => {
				enums.push({
					key: e.id,
					text: e.name,
					data: { key: e.id, name: e.name, color: e.color },
				});
			});
			setDeviceTypes(enums);
		}
	}, [data]);

	// On form submit/error
	const onSubmit = (data: FormFields) => {
		setupDevice({
			variables: {
				name: data.name,
				deviceType: data.deviceType,
			},
		});
	};
	const onError = (errors: any, e: any) => console.log(errors, e);

	if (dtLoading) return <Spinner />;

	return (
		<Dialog
			hidden={isFirstTimeSetup}
			dialogContentProps={{
				type: DialogType.largeHeader,
				title: 'Setup up new device',
				subText:
					"You've logged into your account with a new device. Setup your new device by filling out information about your new device.",
			}}
			modalProps={{
				isBlocking: true,
				styles: { main: { maxWidth: 450 } },
			}}
		>
			<Form onFormSubmit={onSubmit} onFormError={onError}>
				<Stack tokens={{ childrenGap: 10 }}>
					{error && (
						<MessageBar
							messageBarType={MessageBarType.error}
							isMultiline
						>
							{error.message}
							<Link href='www.bing.com' target='_blank'>
								Visit our website for more information.
							</Link>
						</MessageBar>
					)}
					<EditDeviceIcon
						deviceTypes={deviceTypes.map((e) => e.data)}
					/>
					<FormTextBox
						name='name'
						textBoxProps={{
							label: 'Device name',
							placeholder: 'ex: Office desktop',
							required: true,
						}}
					/>
					<FormDropdown
						name='deviceType'
						defaultValue={platform}
						dropdownProps={{
							label: 'Device type',
							options: deviceTypes,
							required: true,
						}}
					/>
				</Stack>
				<DialogFooter>
					<PrimaryButton
						text='Submit'
						type='submit'
						disabled={loading}
						onRenderIcon={() => {
							return loading ? (
								<Spinner size={SpinnerSize.small} />
							) : (
								<></>
							);
						}}
					/>
				</DialogFooter>
			</Form>
		</Dialog>
	);
};

export default DeviceSetupModal;
