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

const App = () => {
	initializeIcons();
	initializeFileTypeIcons();

	return (
		// <ThemeProvider theme={appTheme}>
		<ThemeProvider>
			<Router>
				<HeaderBar />
				<Modals />
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
			</Router>
		</ThemeProvider>
	);
};

export default App;
