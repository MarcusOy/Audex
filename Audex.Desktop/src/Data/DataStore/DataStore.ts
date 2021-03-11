import { IFileTransferPanel } from '../../Components/Modals/FileTransferPanel';
import { IModal } from '../../Components/Modals/Modals';
import { IStackPanel } from '../../Components/Modals/StackPanel';
import { Store } from 'pullstate';
import { IFileUnit } from '../../Components/Uploading/FileUnit';
import { IServer } from '../Services/ServerService';
import { IToasts } from '../../Components/Modals/Toasts';

export interface AudexStore {
	Servers: {
		officialServerList: IServer[];
		serverList: IServer[];
		selectedServer: IServer;
	};
	Authentication: {
		isAuthenticated: boolean;
		username: string;
		accessToken: string;
		refreshToken: string;
		deviceId: string;
	};
	Modals: {
		Toasts: IToasts;
		StackPanel: IStackPanel;
		FilePreview: IModal;
		FileTransfer: IFileTransferPanel;
	};
	Upload: {
		Files: IFileUnit[];
	};
}

const devServer: IServer = {
	hostName: 'http://localhost:5000',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	online: true,
};
const officialServer: IServer = {
	hostName: 'https://audex.app',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	online: false,
};

const initialState: AudexStore = {
	Servers: {
		officialServerList: [officialServer],
		serverList: [devServer],
		selectedServer: devServer,
	},
	Authentication: {
		isAuthenticated: false,
		username: '',
		accessToken: '',
		refreshToken: '',
		deviceId: 'ae3848f7-7f20-4287-aba5-15531d3a1dbf', //TODO: generate DeviceId on first launch
	},
	Modals: {
		Toasts: {
			toasts: [],
		},
		StackPanel: {
			isOpen: false,
			stackId: '',
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
