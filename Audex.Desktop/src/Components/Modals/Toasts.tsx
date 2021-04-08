import {
	IMessageBarProps,
	IMessageBarStyleProps,
	IMessageBarStyles,
	IStyleFunction,
	IStyleFunctionOrObject,
	MessageBar,
	MessageBarType,
} from '@fluentui/react';
import faker from 'faker';
import React, { useState } from 'react';
import { DataStore } from '../../Data/DataStore/DataStore';
import ToastService from '../../Data/Services/ToastService';
import Spacer from '../Spacer';
import UploadToast from '../Modals/UploadToast';

export interface IToasts {
	toasts: IMessageBarProps[];
}

// const fadeOut: IStyleFunctionOrObject<
// 	IMessageBarStyleProps,
// 	IMessageBarStyles
// > = {
// 	root: {
// 		transition: 'opacity 0.5s',
// 		opacity: 0.1,
// 	},
// };

const Toasts = () => {
	// const [toasts, setToasts] = useState<IMessageBarProps[]>(list);
	const toastState = DataStore.useState((s) => s.Modals.Toasts);

	const onDismiss = (key: string) => {
		ToastService.dismiss(key);
		// setToasts(toasts.filter((t) => t.key != key));
	};

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 20,
				right: 20,
				marginLeft: 20,
				zIndex: 2000000,
				maxWidth: '50vh',
			}}
		>
			{toastState.toasts.map((t) => {
				return (
					<div key={t.key}>
						<Spacer />
						<MessageBar
							key={t.key}
							styles={{
								root: {
									opacity: 0.95,
									boxShadow:
										'rgba(0, 0, 0, 0.1) 0px 4px 12px',
									borderRadius: 10,
									width: 300,
								},
							}}
							{...t}
							onDismiss={() => onDismiss(t.key as string)}
						/>
					</div>
				);
			})}
			<UploadToast />
		</div>
	);
};

export default Toasts;
