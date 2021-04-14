import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
	split,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloLinkJWT } from '../Data/ApolloClient/apollo-jwt/index';
import { useCallback, useEffect, useState } from 'react';
import { getMainDefinition } from '@apollo/client/utilities';
import { DataStore } from '../Data/DataStore/DataStore';
import { getGqlString } from '../Data/Helpers';
import { REAUTHENTICATE } from '../Data/Mutations';
import IdentityService from '../Data/Services/IdentityService';
import { customFetch } from '../Data/ApolloClient/apolloCustomFetch';
import ServerService from '../Data/Services/ServerService';

const useAudexApolloClient = (): ApolloClient<any> | undefined => {
	const authState = DataStore.useState((s) => s.Authentication);
	const serverState = DataStore.useState((s) => s.Servers);

	const [client, setClient] = useState<ApolloClient<any> | null>(null);

	const getTokens = useCallback(async () => {
		const accessToken = authState.accessToken;
		const refreshToken = authState.refreshToken;

		return {
			accessToken,
			refreshToken,
		};
	}, [authState]);

	const onRefreshComplete = useCallback(
		async (data: any) => {
			// Find and return the access token and refresh token from the provided fetch callback
			// console.log(data);
			const newAccessToken = data?.data?.reauthenticate?.authToken;
			const newRefreshToken = data?.data?.reauthenticate?.refreshToken;

			// Handle sign out logic if the refresh token attempt failed
			if (!newAccessToken || !newRefreshToken) {
				// Before we log the user out, check if server is down
				if (await ServerService.isSelectedServerUp()) {
					// Server is not down and user's credentials are bad
					console.log(
						'Server is online and rejecting user credientials.'
					);
					IdentityService.logOut();
				} else {
					// Server is down, so do not log out the user
					console.log('Server seems to be down.');
				}
				return;
			}

			// Update Identity
			IdentityService.setUser({
				username: authState.username,
				authToken: newAccessToken,
				refreshToken: newRefreshToken,
			});

			// Return the tokens back to the lib to cache for later use
			return {
				newAccessToken,
				newRefreshToken,
			};
		},
		[authState]
	);

	/**
	 * Configure the body of the token refresh method
	 */
	const fetchBody = useCallback(
		async () => ({
			query: getGqlString(REAUTHENTICATE),
			variables: {
				token: authState.refreshToken,
			},
		}),
		[authState]
	);

	/**
	 * Construct Apollo client's chain of links.
	 * Change the api endpoint ONLY when user changes servers
	 */
	useEffect(() => {
		const selectedServer = serverState.serverList.get(
			serverState.selectedServerHostname
		)!;
		// If no server is selected, do not set a client
		if (!selectedServer) {
			setClient(null);
			return;
		}
		const uri = `${selectedServer.prefix}${selectedServer.hostName}${selectedServer.apiEndpoint}`;

		// Create Apollo Link JWT
		const apolloLinkJWT = ApolloLinkJWT({
			apiUrl: uri,
			getTokens,
			fetchBody,
			onRefreshComplete,
			fetchHeaders: {
				'Content-Type': 'application/json',
			},
			debugMode: true,
		});

		// Normal Apollo HTTP link, with Upload Multi-part capability
		const httpLinkWithUpload = createUploadLink({
			uri: uri,
			fetch: customFetch as any, // customFetch allows progress tracking
		});

		// Websocket Apollo link
		const wsLink = new WebSocketLink({
			uri: `ws://${selectedServer.hostName}${selectedServer.apiEndpoint}`,
			options: {
				reconnect: true,
				lazy: true,
				connectionParams: {
					Authorization: authState.accessToken,
				},
			},
		});

		// Split link between websocket (subscriptions) and HTTP requests (queries, mutations, etc)
		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return (
					definition.kind === 'OperationDefinition' &&
					definition.operation === 'subscription'
				);
			},
			wsLink,
			httpLinkWithUpload
		);

		// Bypass JWT authentication ONLY when logged out
		const links = [splitLink];
		if (authState.isAuthenticated) links.unshift(apolloLinkJWT);

		setClient(
			new ApolloClient({
				link: from(links),
				cache: new InMemoryCache(),
			})
		);
	}, [serverState, authState.isAuthenticated]);

	return (
		client ??
		new ApolloClient({
			uri: 'http://localhost:5000/api/v1/graphql',
			cache: new InMemoryCache(),
		})
	);
};

export default useAudexApolloClient;
