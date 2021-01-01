import { IModal } from './../Components/Modals';
import { IFilePanel } from './../Components/FilePanel';
import { Store } from 'pullstate';
import { useEffect, useState } from 'react';
import { getSplitButtonClassNames } from '@fluentui/react';

export interface AudexStore {
	Authentication: {
		username: string;
		password: string;
		accessToken: string;
		refreshToken: string;
	};
	Modals: {
		FilePanel: IFilePanel;
		FilePreview: IModal;
	};
}

const initialState: AudexStore = {
	Authentication: {
		username: 'admin',
		password: 'fY9TSNMW_xSCZ6-6', // TODO: rely on refresh token, not password
		accessToken: '',
		refreshToken: '',
	},
	Modals: {
		FilePanel: {
			isOpen: false,
			fileId: '',
		},
		FilePreview: {
			isOpen: false,
		},
	},
};

class ExpandedDataStore extends Store<AudexStore> {
	openModal<S extends IModal = IModal>(
		getSubState: (state: AudexStore) => S,
		options?: S
	) {
		let s = getSubState(this.getRawState());
		s = {
			...options!,
			isOpen: true,
		};

		this.update(getSubState);
	}
}

export const DataStore = new ExpandedDataStore(initialState);

export const useLoader = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSecure, setIsSecure] = useState(false);

	useEffect(() => {
		//TODO: load from secure storage
	}, []);

	return { isLoading, isError, isSecure } as const;
};
