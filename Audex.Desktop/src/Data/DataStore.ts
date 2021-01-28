import { IFileTransferPanel } from '../Components/Modals/FileTransferPanel';
import { IModal } from '../Components/Modals/Modals';
import { IFilePanel } from '../Components/Modals/FilePanel';
import { Store } from 'pullstate';
import { useEffect, useState } from 'react';
import { IFileUnit } from '../Components/Uploading/FileUnit';

export interface AudexStore {
	Authentication: {
		isAuthenticated: boolean;
		username: string;
		accessToken: string;
		refreshToken: string;
		deviceId: string;
	};
	Modals: {
		FilePanel: IFilePanel;
		FilePreview: IModal;
		FileTransfer: IFileTransferPanel;
	};
	Upload: {
		Files: IFileUnit[];
	};
}

const initialState: AudexStore = {
	Authentication: {
		isAuthenticated: false,
		username: 'admin',
		accessToken: '',
		refreshToken: '',
		deviceId: 'ae3848f7-7f20-4287-aba5-15531d3a1dbf',
	},
	Modals: {
		FilePanel: {
			isOpen: false,
			fileId: '',
		},
		FilePreview: {
			isOpen: false,
		},
		FileTransfer: {
			isOpen: false,
			fileId: '',
			mode: 'upload',
		},
	},
	Upload: {
		Files: [],
	},
};

export const DataStore = new Store<AudexStore>(initialState);

export const useLoader = () => {
	const [isLoading] = useState(false);
	const [isError] = useState(false);
	const [isSecure] = useState(false);

	useEffect(() => {
		//TODO: load from secure storage
	}, []);

	return { isLoading, isError, isSecure } as const;
};
