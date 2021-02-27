import {
	Checkbox,
	ComboBox,
	Dropdown,
	Icon,
	IDropdownOption,
	Label,
	Link,
	MessageBar,
	MessageBarType,
	Persona,
	PersonaPresence,
	PersonaSize,
	PrimaryButton,
	SelectableOptionMenuItemType,
	Spinner,
	Stack,
	Text,
	TextField,
} from '@fluentui/react';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import Flex from '../Components/Flex';
import Logo from '../Components/Header/Logo';
import Spacer from '../Components/Spacer';
import useResponsive from '../Hooks/useResponsive';
import { useMutation } from '@apollo/client';
import IdentityService from '../Data/Services/IdentityService';
import { AUTHENTICATE } from '../Data/Mutations';
import { DataStore } from '../Data/DataStore/DataStore';

interface FormFields {
	username: string;
	server: string;
	password: string;
	isPersistent: boolean;
}

const serverOptions: IDropdownOption[] = [
	{
		key: 'officialHeader',
		text: 'Official servers',
		itemType: SelectableOptionMenuItemType.Header,
	},
	{ key: 'default', text: 'audex.app', data: { online: false } },
	{
		key: 'unofficialHeader',
		text: 'Other servers',
		itemType: SelectableOptionMenuItemType.Header,
	},
	{ key: '1', text: 'localhost:5001', data: { online: true } },
	{
		key: 'add',
		text: 'Add server...',
	},
];

const onServerRenderOption = (option: IDropdownOption): JSX.Element => {
	if (option.itemType == SelectableOptionMenuItemType.Header)
		return <span>{option.text}</span>;

	const online = (option.data && option.data.online) ?? false;

	return (
		<div style={{ margin: '5px 10px' }}>
			{option.data && (
				<Persona
					text={option.text}
					size={PersonaSize.size8}
					presence={
						online ? PersonaPresence.online : PersonaPresence.busy
					}
				/>
			)}
		</div>
	);
};

const onServerRenderSelectedItem = (
	options: IDropdownOption[]
): JSX.Element => {
	const option = options[0];
	const online = option.data.online ?? false;
	return (
		<div style={{ marginTop: 5 }}>
			{option.data && (
				<Persona
					text={option.text}
					size={PersonaSize.size8}
					presence={
						online ? PersonaPresence.online : PersonaPresence.busy
					}
				/>
			)}
		</div>
	);
};

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		errors,
		control,
	} = useForm<FormFields>();
	const onSubmit = (data: FormFields) =>
		authenticate({
			variables: {
				username: data.username,
				password: data.password,
			},
		})
			.then((r) => {
				console.log(r);
				IdentityService.setUser({
					...r.data.authenticate,
					username: data.username,
				});
			})
			.catch((r) => {
				console.log(r);
			});
	const authState = DataStore.useState((s) => s.Authentication);
	const [authenticate, { loading, error }] = useMutation(AUTHENTICATE);
	const { screenIsAtLeast } = useResponsive();

	return (
		<Flex
			style={{
				height: '100vh',
				background:
					'radial-gradient(circle, rgba(225,246,255,1) 0%, rgba(255,255,255,1) 100%)',
			}}
			justifyContent='center'
			alignItems='center'
		>
			<Stack
				style={{
					padding: 35,
					boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
					width: 500,
					zIndex: 1,
					backgroundColor: 'white',
				}}
				tokens={{ childrenGap: 10 }}
			>
				<Logo />
				<Text variant='xxLarge'>Login</Text>

				{error ? (
					<MessageBar
						messageBarType={MessageBarType.error}
						isMultiline={false}
						// onDismiss={p.resetChoice}
					>
						{error.message}
						<Link href='www.bing.com' target='_blank'>
							Visit our website for more information.
						</Link>
					</MessageBar>
				) : (
					<></>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack>
						<Label>Identity</Label>
						<Stack
							horizontal={screenIsAtLeast('sm')}
							style={{ display: 'flex' }}
						>
							<div style={{ flexGrow: 1 }}>
								<Controller
									control={control}
									name='username'
									defaultValue={authState.username}
									render={(
										{ onChange, onBlur, value, name, ref },
										{ invalid, isTouched, isDirty }
									) => (
										<TextField
											name='username'
											placeholder='Username'
											suffix='@'
											onChange={onChange}
											value={value}
										/>
									)}
								/>
							</div>
							<Controller
								control={control}
								name='server'
								render={(
									{ onChange, onBlur, value, name, ref },
									{ invalid, isTouched, isDirty }
								) => (
									<Dropdown
										onRenderOption={onServerRenderOption}
										onRenderTitle={
											onServerRenderSelectedItem
										}
										ref={ref}
										selectedKey={value}
										onBlur={onBlur}
										onChange={(e, d) => onChange(d.key)}
										defaultSelectedKey='1'
										options={serverOptions}
									/>
								)}
							/>
						</Stack>
					</Stack>
					<Controller
						control={control}
						name='password'
						render={(
							{ onChange, onBlur, value, name, ref },
							{ invalid, isTouched, isDirty }
						) => (
							<TextField
								label='Password'
								type='password'
								placeholder='·····'
								onChange={onChange}
								// canRevealPassword //TODO: figure out why this submits the form ???
							/>
						)}
					/>
					<Spacer size={10} />
					<Stack horizontal>
						<Controller
							control={control}
							name='persistent'
							render={(
								{ onChange, onBlur, value, name, ref },
								{ invalid, isTouched, isDirty }
							) => (
								<Checkbox
									label='Keep me signed in'
									onChange={(e, d) => onChange(d.valueOf())}
									defaultChecked
								/>
							)}
						/>

						<Spacer orientation='horizontal' grow={true} />
						<PrimaryButton
							type='submit'
							text='Login'
							disabled={loading}
						/>
					</Stack>
					{loading ? (
						<Spinner
							label='Logging in...'
							ariaLive='assertive'
							labelPosition='left'
						/>
					) : (
						<></>
					)}
				</form>
			</Stack>
		</Flex>
	);
};

export default LoginPage;
