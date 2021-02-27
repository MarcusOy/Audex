import { useEffect, useState } from 'react';
import PersistenceService from '../Services/PersistenceService';
import { DataStore } from './DataStore';

const useLoader = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		try {
			// Using JS IIFE here (look it up if you don't remember)
			(async function load() {
				console.log('Loader is processsing...');
				const u =
					(await PersistenceService.getUnsecured('username')) ?? '';
				const a = (await PersistenceService.getSecured('auth')) ?? '';
				const r =
					(await PersistenceService.getSecured('refresh')) ?? '';

				console.log(`Getting auth from storage... ${u} ${a} ${r}`);
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
