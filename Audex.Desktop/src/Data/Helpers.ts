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
