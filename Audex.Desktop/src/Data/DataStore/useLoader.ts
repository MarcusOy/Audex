import { useEffect, useState } from 'react';
import PersistenceService from '../Services/PersistenceService';
import { DataStore } from './DataStore';

const useLoader = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		try {
			// Using IIFE here
			(async function load() {
				console.log('Loader is processsing...');
				const u =
					(await PersistenceService.getUnsecured('username')) ?? '';
				const a = (await PersistenceService.getSecured('auth')) ?? '';
				const r =
					(await PersistenceService.getSecured('refresh')) ?? '';
				DataStore.update((s) => {
					// Authentication
					s.Authentication.username = u;

					if (a && r) {
						s.Authentication.isAuthenticated = true;
						s.Authentication.accessToken = a;
						s.Authentication.refreshToken = r;
					} else {
						s.Authentication.isAuthenticated = false;
					}
					console.log('Loader is done processsing.');
					setIsLoading(false);
				});
			})();
		} catch (e) {
			setIsError(true);
			setIsLoading(false);
			console.log('Loader has failed.');
			console.log(e);
		}
	}, []);

	return { isLoading, isError } as const;
};

export default useLoader;
