import * as React from 'react';
import {
	initializeIcons,
	Spinner,
	SpinnerSize,
	ThemeProvider,
} from '@fluentui/react';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import HeaderBar from './Components/Header/HeaderBar';
import HomePage from './Pages/HomePage';
import Modals from './Components/Modals/Modals';
import { DataStore } from './Data/DataStore/DataStore';
import LoginPage from './Pages/LoginPage';
import { ApolloProvider } from '@apollo/client';
import useLoader from './Data/DataStore/useLoader';
import useAudexApolloClient from './Hooks/useAudexApolloClient';

import './App.css';

const App = () => {
	const { isLoading, isError } = useLoader();
	const state = DataStore.useState();

	initializeIcons();
	initializeFileTypeIcons();

	const client = useAudexApolloClient();

	let body;
	if (isError) body = <p>error</p>;
	if (isLoading) body = <Spinner size={SpinnerSize.large} />;
	if (!state.Authentication) body = <p>DataStore is loading...</p>;

	console.log(state);

	return (
		body ?? (
			// <ThemeProvider theme={appTheme}>
			<ApolloProvider client={client}>
				<ThemeProvider>
					<Router>
						{!state.Authentication.isAuthenticated ? (
							<LoginPage />
						) : (
							<>
								<HeaderBar />
								<Switch>
									<Route path='/' exact>
										<Redirect to='/Home/Recent' />
									</Route>

									<Route path='/Home/:tab'>
										<HomePage />
									</Route>
									<Route path='/Users'></Route>
									<Route path='/Settings'></Route>
								</Switch>
							</>
						)}
						<Modals />
					</Router>
				</ThemeProvider>
			</ApolloProvider>
		)
	);
};

export default App;
