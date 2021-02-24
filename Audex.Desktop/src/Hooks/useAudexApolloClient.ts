import {
	ApolloClient,
	ApolloLink,
	ApolloProvider,
	createHttpLink,
	from,
	fromPromise,
	InMemoryCache,
	NextLink,
	Operation,
	RequestHandler,
} from '@apollo/client';
import { onError } from 'apollo-link-error';
import { ApolloLinkJWT } from 'apollo-link-jwt';
import { DataStore } from '../Data/DataStore/DataStore';
import { REAUTHENTICATE } from '../Data/Mutations';
import IdentityService from '../Data/Services/IdentityService';
import { useCallback, useEffect, useState, createRef } from 'react';

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
			console.log(`onRefreshComplete: ${data}`);
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
			// TODO: use IdentityService
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

	// const authLink = new ApolloLink((operation, forward) => {
	// 	if (authState.accessToken) {
	// 		operation.setContext({
	// 			headers: {
	// 				Authorization: `Bearer ${authState.accessToken}`,
	// 			},
	// 		});
	// 	}
	// 	return forward(operation);
	// });

	// const authErrorLink = onError(
	// 	({ graphQLErrors, networkError, operation, forward }) => {
	// 		if (graphQLErrors) {
	// 			for (const err of graphQLErrors) {
	// 				if (err.extensions!.code == 'UNAUTHENTICATED')
	// 					IdentityService.logOut();
	// 			}
	// 		}
	// 	}
	// );

	/**
	 * Change the api endpoint ONLY when user changes servers
	 */
	useEffect(() => {
		const uri = `${serverState.selectedServer.hostName}${serverState.selectedServer.apiEndpoint}`;

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

		const links = [httpLink];
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
