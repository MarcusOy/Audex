import * as React from 'react';
import {
	initializeIcons,
	PartialTheme,
	Spinner,
	SpinnerSize,
	ThemeProvider,
} from '@fluentui/react';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { BrowserRouter as Router } from 'react-router-dom';
import { enableMapSet } from 'immer';
import Modals from './Components/Modals/Modals';
import { DataStore } from './Data/DataStore/DataStore';
import LoginPage from './Pages/LoginPage';
import { ApolloProvider } from '@apollo/client';
import useLoader from './Data/DataStore/useLoader';
import useAudexApolloClient from './Hooks/useAudexApolloClient';

import './App.css';
import ServerService from './Data/Services/ServerService';
import AuthorizedRoot from './Pages/AuthorizedRoot';
import NotificationService from './Data/Services/NotificationService';

const App = () => {
	const { isLoading, isError } = useLoader();
	const state = DataStore.useState();

	React.useEffect(() => {
		ServerService.init();
		NotificationService.init();
		initializeIcons();
		initializeFileTypeIcons();
		enableMapSet();
	}, []);

	const client = useAudexApolloClient();

	let body;
	if (isError) body = <p>error</p>;
	if (isLoading) body = <Spinner size={SpinnerSize.large} />;
	if (!state.Authentication) body = <p>DataStore is loading...</p>;

	console.log(state);

	return (
		body ?? (
			<ApolloProvider client={client}>
				<ThemeProvider>
					{/* <ThemeProvider theme={myTheme}> */}
					<Router>
						{!state.Authentication.isAuthenticated ? (
							<LoginPage />
						) : (
							<AuthorizedRoot />
						)}
						<Modals />
					</Router>
				</ThemeProvider>
			</ApolloProvider>
		)
	);
};

// Dark theme
const myTheme: PartialTheme = {
	palette: {
		themePrimary: '#2196f2',
		themeLighterAlt: '#01060a',
		themeLighter: '#051827',
		themeLight: '#0a2e49',
		themeTertiary: '#145b91',
		themeSecondary: '#1e86d5',
		themeDarkAlt: '#37a2f4',
		themeDark: '#55b0f5',
		themeDarker: '#80c4f8',
		neutralLighterAlt: '#1b2328',
		neutralLighter: '#222b31',
		neutralLight: '#2d383f',
		neutralQuaternaryAlt: '#344048',
		neutralQuaternary: '#3a474f',
		neutralTertiaryAlt: '#55646d',
		neutralTertiary: '#e0e0e0',
		neutralSecondary: '#e5e5e5',
		neutralPrimaryAlt: '#eaeaea',
		neutralPrimary: '#d1d1d1',
		neutralDark: '#f4f4f4',
		black: '#f9f9f9',
		white: '#141b1f',
	},
};

export default App;
