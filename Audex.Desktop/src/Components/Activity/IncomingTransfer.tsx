import IncomingStackTransfer from './IncomingStackTransfer';
import IncomingClipTransfer from './IncomingClipTransfer';
import { IClipRow } from '../../Pages/Tabs/ClipsTab';

export interface ITransferRow {
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
	clip: IClipRow;
	fromDevice: {
		id: string;
		name: string;
	};
}

export interface IIncomingTransferProps {
	transfer: ITransferRow;
}

const IncomingTransfer = (p: IIncomingTransferProps) => {
	// Incoming transfer cannot have neither a stack
	// or clip or both a stack and a clip
	if (
		(p.transfer.stack && p.transfer.clip) ||
		(!p.transfer.stack && !p.transfer.clip)
	)
		return <p>This transfer is invalid.</p>;

	if (p.transfer.stack)
		return <IncomingStackTransfer transfer={p.transfer} />;

	if (p.transfer.clip) return <IncomingClipTransfer transfer={p.transfer} />;

	return <p>This transfer is invalid.</p>;
};

export default IncomingTransfer;
