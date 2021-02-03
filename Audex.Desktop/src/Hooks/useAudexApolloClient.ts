import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	from,
	fromPromise,
	InMemoryCache,
} from '@apollo/client';
import { ApolloLinkJWT } from 'apollo-link-jwt';
import { DataStore } from '../Data/DataStore/DataStore';
import { REAUTHENTICATE } from '../Data/Mutations';
import IdentityService from '../Data/Services/IdentityService';
import { useCallback, useEffect, useState } from 'react';

const useAudexApolloClient = (): ApolloClient<any> | undefined => {
	const authState = DataStore.useState((s) => s.Authentication);
	const serverState = DataStore.useState((s) => s.Servers);

	const [client, setClient] = useState<ApolloClient<any>>();

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
			console.log(data);
			const newAccessToken = data?.data?.token?.accessToken;
			const newRefreshToken = data?.data?.token?.refreshToken;

			// Handle sign out logic if the refresh token attempt failed
			if (!newAccessToken || !newRefreshToken) {
				console.log(
					'Redirect back to login, because the refresh token was expired!'
				);

				IdentityService.logOut();

				return;
			}

			// Update tokens in DataStore
			DataStore.update((s) => {
				(s.Authentication.accessToken = newAccessToken),
					(s.Authentication.refreshToken = newRefreshToken);
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
			query: REAUTHENTICATE,
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
		/**
		 * Create Apollo Link JWT
		 */
		const apolloLinkJWT = ApolloLinkJWT({
			apiUrl: `${serverState.selectedServer.hostName}${serverState.selectedServer.apiEndpoint}`,
			getTokens,
			fetchBody,
			onRefreshComplete,
			debugMode: true,
		});

		const httpLink = createHttpLink({
			uri: `${serverState.selectedServer.hostName}${serverState.selectedServer.apiEndpoint}`,
		});

		setClient(
			new ApolloClient({
				link: from([
					apolloLinkJWT,
					httpLink, // Add terminating link last
				]),
				cache: new InMemoryCache(),
			})
		);
	}, [serverState]);

	return (
		client ??
		new ApolloClient({
			uri: 'http://localhost:5000/api/v1/graphql',
			cache: new InMemoryCache(),
		})
	);
};

export default useAudexApolloClient;
