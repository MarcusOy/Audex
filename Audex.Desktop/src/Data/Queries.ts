import { gql } from '@apollo/client';

export const WHO_AM_I = gql`
	query {
		whoAmI {
			username
			group {
				name
			}
		}
	}
`;
