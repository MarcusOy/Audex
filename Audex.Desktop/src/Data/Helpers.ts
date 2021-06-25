import { DocumentNode } from 'graphql';

export function getGqlString(doc: DocumentNode) {
	return doc.loc && doc.loc.source.body;
}

export function getFileExt(file: string) {
	return file.split('.')[file.split('.').length - 1];
}

export function getFileName(filePath: string) {
	const dirChar = filePath.indexOf('\\') > 0 ? '\\' : '/';
	return filePath.split(dirChar).pop();
}

export function getFolderName(filePath: string) {
	const dirChar = filePath.indexOf('\\') > 0 ? '\\' : '/';
	const f = filePath.split(dirChar);
	f.pop();
	return f.join(dirChar);
}

export const getInitials = (fullName: any) => {
	const allNames = fullName.trim().split(' ');
	const initials = allNames.reduce(
		(acc: any, curr: any, index: any) => {
			if (index === 0 || index === allNames.length - 1) {
				acc = `${acc}${curr.charAt(0).toUpperCase()}`;
			}
			return acc;
		},
		['']
	);
	return initials;
};

export const getOS = () => {
	const platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
	let os = null;
	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'MAC_OS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'WINDOWS';
	} else if (!os && /Linux/.test(platform)) {
		os = 'LINUX';
	}
	return os;
};
