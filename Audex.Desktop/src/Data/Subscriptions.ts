import { gql } from '@apollo/client';

export const ON_STACKS_UPDATE = gql`
	subscription {
		onStacksUpdate {
			id
		}
	}
`;

export const ON_CLIPS_UPDATE = gql`
	subscription {
		onClipsUpdate {
			id
			createdOn
			uploadedByDevice {
				id
				name
				deviceType {
					name
				}
			}
			content
			isSecured
			deletedOn
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
