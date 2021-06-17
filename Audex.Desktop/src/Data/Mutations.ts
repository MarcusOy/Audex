import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
	mutation Authentication(
		$username: String
		$password: String
		$device: String
		$code: String
	) {
		authenticate(
			username: $username
			password: $password
			device: $device
			code: $code
		) {
			authToken
			refreshToken
		}
	}
`;

export const REAUTHENTICATE = gql`
	mutation Authentication($token: String) {
		reauthenticate(token: $token) {
			authToken
			refreshToken
		}
	}
`;

export const UPLOAD_FILE = gql`
	mutation($file: Upload!) {
		uploadFile(f: $file)
	}
`;

export const CREATE_STACK = gql`
	mutation($fileIds: [Uuid!]) {
		createStack(fileIds: $fileIds) {
			id
		}
	}
`;

export const CREATE_STARTER_STACK = gql`
	mutation {
		createStartingStack {
			files {
				id
			}
		}
	}
`;

export const ENSURE_STACK = gql`
	mutation($stackId: Uuid!, $fileIds: [Uuid!]!) {
		ensureInStack(stackId: $stackId, fileIds: $fileIds) {
			id
		}
	}
`;

export const RENAME_STACK = gql`
	mutation($stackId: Uuid!, $newName: String) {
		renameStack(stackId: $stackId, newName: $newName)
	}
`;

export const RENAME_FILE = gql`
	mutation($fileId: Uuid!, $newName: String) {
		renameFile(fileId: $fileId, newName: $newName)
	}
`;

export const DELETE_STACK = gql`
	mutation($stackIds: [Uuid!]) {
		deleteStacks(stackIds: $stackIds) {
			id
		}
	}
`;

export const DELETE_FILE = gql`
	mutation($fileIds: [Uuid!]) {
		deleteFiles(fileIds: $fileId) {
			id
		}
	}
`;

export const GET_DOWNLOAD_TOKENS_FOR_STACK = gql`
	mutation($stackId: Uuid!) {
		downloadTokensForStack(stackId: $stackId) {
			id
		}
	}
`;
