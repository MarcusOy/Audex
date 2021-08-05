// import { IFileTransferPanel } from '../../Components/Modals/FileTransferPanel';
import { IModal } from '../../Components/Modals/Modals';
import { IStackPanel } from '../../Components/Modals/StackPanel';
import { Store } from 'pullstate';
import { IFileUnit } from '../../Components/Uploading/FileUnit';
import { IServer } from '../Services/ServerService';
import { IToasts } from '../../Components/Modals/Toasts';
import { IDownload } from '../Services/DownloadService';

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
	Identity?: Identity;
	Modals: {
		Toasts: IToasts;
		StackPanel: IStackPanel;
		FilePreview: IModal;
	};
	Upload: {
		Files: File[];
		FileUnits: IFileUnit[];
		CurrentStackContext?: string;
	};
	Download: {
		Downloads: Map<string, IDownload>;
		NewItems: number;
	};
}

export interface Identity {
	user: {
		id: string;
		username: string;
		devices: {
			id: string;
			name: string;
			deviceType: {
				name: string;
				color: string;
			};
			createdOn: string;
		}[];
		group: {
			name: string;
		};
		createdOn: string;
	};
	device: {
		id: string;
		name: string;
		isFirstTimeSetup: boolean;
		createdOn: string;
		deviceType: {
			name: string;
			color: string;
		};
		incomingTransfers: IncomingTransfer[];
	};
}

export interface IncomingTransfer {
	id: string;
	createdOn: string;
	stack: {
		id: string;
		name: string;
		vanityName: {
			name: string;
			suffix: string;
		};
		files: {
			id: string;
			name: string;
			fileExtension: string;
		}[];
	};
	fromDevice: {
		id: string;
		name: string;
	};
}

const devServer: IServer = {
	prefix: 'http://',
	hostName: 'localhost:5000',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	downloadEndpoint: '/api/v1/Download',
	isOfficial: false,
	isOnline: true,
};
const officialServer: IServer = {
	prefix: 'https://',
	hostName: 'audex.app',
	apiVersion: 'v1',
	apiEndpoint: '/api/v1/graphql',
	downloadEndpoint: '/api/v1/Download',
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
		deviceId: '',
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
		CurrentStackContext: undefined,
	},
	Download: {
		Downloads: new Map(),
		NewItems: 0,
	},
};

export const DataStore = new Store<AudexStore>(initialState);
