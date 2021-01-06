import { IFileTransferPanel } from '../Components/Modals/FileTransferPanel';
import { IModal } from '../Components/Modals/Modals';
import { IFilePanel } from '../Components/Modals/FilePanel';
import { Store } from 'pullstate';
import { useEffect, useState } from 'react';
import { IFileUnit } from '../Components/Uploading/FileUnit';

export interface AudexStore {
	Authentication: {
		username: string;
		password: string;
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
		username: 'admin',
		password: 'fY9TSNMW_xSCZ6-6', // TODO: rely on refresh token, not password
		accessToken:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZlYjExYjg3LWM0NTEtNDM2Zi1iMzQ3LTBlMDcyNGI1NmI4MyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJQdWJsaWNseVNoYXJlRmlsZXMiLCJQcml2YXRlbHlTaGFyZUZpbGVzIiwiRGV2aWNlTWFuYWdlbWVudCIsIlVzZXJNYW5hZ2VtZW50IiwiVmlld0ZpbGVzIiwiVXBsb2FkRmlsZXMiLCJMb2dpbiJdLCJleHAiOjE2MDk5OTUwMTAsImlzcyI6ImF1ZGV4LmFwcCIsImF1ZCI6ImF1ZGV4LmFwcCJ9.n1LrBUFrz2JOGOpamdWGryvIeGVw_v5Wrwi5Oj6xwEE',
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
