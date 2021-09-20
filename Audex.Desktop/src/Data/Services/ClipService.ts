import { IClipRow } from './../../Pages/Tabs/ClipsTab';

import ToastService, { SuccessToast } from './ToastService';

class ClipService {
	static copyClip(clip: IClipRow, doNotDecrypt = false) {
		let content = clip.content;
		let message = 'Copied clip to clipboard!';
		if (clip.isSecured && !doNotDecrypt) {
			// decrypt content using private key
			content = 'decrypted content';
			message = 'Decrypted and copied clip to clipboard!';
		}
		navigator.clipboard.writeText(content).then(() => {
			ToastService.push(SuccessToast(message), 3);
		});
	}
}
export default ClipService;
