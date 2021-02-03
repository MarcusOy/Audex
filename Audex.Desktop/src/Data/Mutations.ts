import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
	mutation Authentication($username: String, $password: String) {
		authenticate(username: $username, password: $password) {
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
