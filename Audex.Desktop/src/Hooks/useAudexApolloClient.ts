import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
	split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloLinkJWT } from './jwt/index';
import { DataStore } from '../Data/DataStore/DataStore';
import { REAUTHENTICATE } from '../Data/Mutations';
import IdentityService from '../Data/Services/IdentityService';
import { useCallback, useEffect, useState } from 'react';
import { getGqlString } from '../Data/Helpers';
import { getMainDefinition } from '@apollo/client/utilities';

const useAudexApolloClient = (): ApolloClient<any> | undefined => {
	const authState = DataStore.useState((s) => s.Authentication);
	const serverState = DataStore.useState((s) => s.Servers);

	const [client, setClient] = useState<ApolloClient<any> | null>(null);

	const getTokens = useCallback(async () => {
		const accessToken = authState.accessToken;
		const refreshToken = authState.refreshToken;

		console.log('Tokens Accessed...');

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
				console.log(
					'Redirect back to login, because the refresh token was expired!'
				);
				IdentityService.logOut();
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
	 * Change the api endpoint ONLY when user changes servers
	 */
	useEffect(() => {
		const uri = `${serverState.selectedServer.prefix}${serverState.selectedServer.hostName}${serverState.selectedServer.apiEndpoint}`;

		if (!serverState) {
			setClient(null);
			return;
		}
		/**
		 * Create Apollo Link JWT
		 */
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

		const httpLink = createHttpLink({
			uri: uri,
		});

		const wsLink = new WebSocketLink({
			uri: `ws://${serverState.selectedServer.hostName}${serverState.selectedServer.apiEndpoint}`,
			options: {
				reconnect: true,
				lazy: true,
				connectionParams: {
					Authorization: authState.accessToken,
				},
			},
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return (
					definition.kind === 'OperationDefinition' &&
					definition.operation === 'subscription'
				);
			},
			wsLink,
			httpLink
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
