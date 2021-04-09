import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
	mutation Authentication(
		$username: String
		$password: String
		$device: String
	) {
		authenticate(
			username: $username
			password: $password
			device: $device
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
