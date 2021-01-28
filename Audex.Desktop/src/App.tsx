import * as React from 'react';
import { initializeIcons, ThemeProvider } from '@fluentui/react';
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
import { DataStore } from './Data/DataStore';
import LoginPage from './Pages/LoginPage';
import './App.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: 'http://localhost:5000/api/v1/graphql',
	cache: new InMemoryCache(),
});

const App = () => {
	const state = DataStore.useState();
	initializeIcons();
	initializeFileTypeIcons();

	return (
		// <ThemeProvider theme={appTheme}>
		<ApolloProvider client={client}>
			<ThemeProvider>
				<Router>
					<Modals />
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
				</Router>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default App;
