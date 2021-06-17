import { useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import HeaderBar from '../Components/Header/HeaderBar';
import { DataStore } from '../Data/DataStore/DataStore';
import { WHO_AM_I } from '../Data/Queries';
import IdentityService from '../Data/Services/IdentityService';
import HomePage from './HomePage';

const AuthorizedRoot = () => {
	const { data, loading, error, refetch } = useQuery(WHO_AM_I);
	// const onIdentityUpdate = useSubscription(ON_WHO_AM_I_UPDATE, {});

	// Set identity based on WHO_AM_I query
	useEffect(() => {
		if (data && data.whoAmI) IdentityService.setIdentity(data.whoAmI);
	}, [data]);

	// Refetch identity when subscription is triggered
	// useEffect(() => {
	// 	refetch();
	// }, [onIdentityUpdate.data]);

	return (
		<>
			<HeaderBar />
			<Switch>
				<Route path='/' exact>
					<Redirect to='/Home/Stacks' />
				</Route>

				<Route path='/Home/:tab'>
					<HomePage />
				</Route>
				<Route path='/Users'></Route>
				<Route path='/Settings'></Route>
			</Switch>
		</>
	);
};

export default AuthorizedRoot;
