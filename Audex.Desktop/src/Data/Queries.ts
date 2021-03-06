import { gql } from '@apollo/client';

export const WHO_AM_I = gql`
	query {
		whoAmI {
			id
			username
			devices {
				id
				name
				deviceType {
					name
					color
				}
				createdOn
			}
			group {
				name
			}
			createdOn
		}
	}
`;

export const GET_STACKS = gql`
	query {
		stacks {
			nodes {
				id
				name
				stackCategory {
					name
					color
				}
				createdOn
				uploadedByDevice {
					name
				}
				files {
					id
					name
					fileExtension
					fileSize
				}
			}
		}
	}
`;

export const GET_STACK = gql`
	query($stackId: Uuid!) {
		stacks(where: { id: { in: [$stackId] } }) {
			nodes {
				id
				name
				stackCategory {
					name
					color
				}
				createdOn
				uploadedByDevice {
					name
				}
				files {
					id
					name
					fileExtension
					fileSize
				}
			}
		}
	}
`;
