import { gql } from '@apollo/client';

export const ON_STACKS_UPDATE = gql`
	subscription {
		onStacksUpdate {
			id
		}
	}
`;

export const ON_WHO_AM_I_UPDATE = gql`
	subscription {
		onUserUpdate {
			id
		}
	}
`;
