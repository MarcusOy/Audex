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
