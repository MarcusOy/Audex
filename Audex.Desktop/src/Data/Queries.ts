import { gql } from '@apollo/client';

export const WHO_AM_I = gql`
	query {
		whoAmI {
			user {
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
			device {
				id
				name
				isFirstTimeSetup
				createdOn
				deviceType {
					name
					color
				}
				incomingTransfers {
					id
					createdOn
					stack {
						id
						name
						vanityName {
							name
							suffix
						}
						files {
							id
							name
							fileExtension
						}
					}
					fromDevice {
						id
						name
					}
				}
			}
		}
	}
`;

export const GET_STACKS = gql`
	query {
		stacks {
			nodes {
				id
				name
				vanityName {
					name
					suffix
				}
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
				vanityName {
					name
					suffix
				}
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

export const GET_FORM = gql`
	query($entityName: String) {
		formSchema(entityName: $entityName) {
			schema
			uISchema
		}
	}
`;

export const GET_DEVICE_TYPES = gql`
	query {
		deviceTypes {
			nodes {
				id
				name
				color
			}
		}
	}
`;
