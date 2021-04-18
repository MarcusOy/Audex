// import { IFileTransferPanel } from '../../Components/Modals/FileTransferPanel';
import { IModal } from '../../Components/Modals/Modals';
import { IStackPanel } from '../../Components/Modals/StackPanel';
import { Store } from 'pullstate';
import { IFileUnit } from '../../Components/Uploading/FileUnit';
import { IServer } from '../Services/ServerService';
import { IToasts } from '../../Components/Modals/Toasts';

export interface AudexStore {
	Servers: {
		serverList: Map<string, IServer>;
		selectedServerHostname: string;
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
	isOfficial: false,
	isOnline: true,
};
const officialServer: IServer = {
	prefix: 'https://',
	hostName: 'audex.app',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	isOfficial: true,
	isOnline: false,
};

const initialState: AudexStore = {
	Servers: {
		// serverList: [officialServer, devServer],
		serverList: new Map([
			[devServer.hostName, devServer],
			[officialServer.hostName, officialServer],
		]),
		selectedServerHostname: devServer.hostName,
	},
	Authentication: {
		isAuthenticated: false,
		username: '',
		accessToken: '',
		refreshToken: '',
		deviceId: '5d968e2c-c9b3-46e9-8a08-0fd8cad237fd', //TODO: generate DeviceId on first launch
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
