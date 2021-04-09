// import { IFileTransferPanel } from '../../Components/Modals/FileTransferPanel';
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
	};
	Upload: {
		Files: File[];
		FileUnits: IFileUnit[];
		CurrentStackContext: string;
	};
}

const devServer: IServer = {
	prefix: 'http://',
	hostName: 'localhost:5000',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	online: true,
};
const officialServer: IServer = {
	prefix: 'https://',
	hostName: 'audex.app',
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
		deviceId: 'dd3bba8a-9e02-4866-90a9-1d8814285aa2', //TODO: generate DeviceId on first launch
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
	},
	Upload: {
		Files: [],
		FileUnits: [],
		CurrentStackContext: '',
	},
};

export const DataStore = new Store<AudexStore>(initialState);
