import { gql } from '@apollo/client';

export const ON_STACKS_UPDATE = gql`
	subscription {
		onStacksUpdate {
			id
		}
	}
`;
