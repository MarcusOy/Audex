import React from 'react';
import faker from 'faker';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IMessageBarProps, MessageBarType } from '@fluentui/react';
import { DataStore } from '../DataStore/DataStore';

class ToastService {
	static toasts: IMessageBarProps[] = [];

	static push(t: IMessageBarProps, d?: number) {
		t.key = faker.random.alphaNumeric(12);
		DataStore.update((s) => {
			const ts: IMessageBarProps[] = new Array<IMessageBarProps>().concat(
				DataStore.getRawState().Modals.Toasts.toasts.slice()
			);
			ts.push(t);
			// @ts-ignore
			s.Modals.Toasts.toasts = ts;
		});

		if (d)
			setTimeout(() => {
				this.dismiss(t.key as string);
			}, d * 1000);
	}

	static dismiss(k: string) {
		DataStore.update((s) => {
			// @ts-ignore
			s.Modals.Toasts.toasts = DataStore.getRawState().Modals.Toasts.toasts.filter(
				(t) => t.key != k
			);
		});
	}

	static pop(i?: number) {
		DataStore.update((s) => {
			const ts: IMessageBarProps[] = DataStore.getRawState().Modals.Toasts.toasts.slice();
			i = i ?? 1;
			Array(i)
				.fill(i)
				.map(() => {
					ts.pop();
				});
			// @ts-ignore
			s.Modals.Toasts.toasts = ts;
		});
	}
	static clear() {
		DataStore.update((s) => {
			s.Modals.Toasts.toasts = [];
		});
	}
}
export default ToastService;

export const ErrorToast = (m: string) => {
	return {
		messageBarType: MessageBarType.blocked,
		children: <>{m}</>,
	};
};

export const TestInfo = () => {
	return {
		messageBarType: MessageBarType.info,
		children: <>This is a test.</>,
	};
};

export const TestBlocked = () => {
	return {
		messageBarType: MessageBarType.blocked,
		truncated: true,
		overflowButtonAriaLabel: 'See more',
		children: (
			<>
				{' '}
				<b>
					Blocked MessageBar - single line, with dismiss button and
					truncated text.
				</b>{' '}
				Truncation is not available if you use action buttons or
				multiline and should be used sparingly. Lorem ipsum dolor sit
				amet, consectetur adipiscing elit. Morbi luctus, purus a
				lobortis tristique, odio augue pharetra metus, ac placerat nunc
				mi nec dui. Vestibulum aliquam et nunc semper scelerisque.
				Curabitur vitae orci nec quam condimentum porttitor et sed
				lacus.
			</>
		),
	};
};
