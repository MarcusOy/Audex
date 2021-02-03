import { useEffect, useState } from 'react';
import PersistenceService from '../Services/PersistenceService';
import { DataStore } from './DataStore';

const useLoader = () => {
	const [isLoading] = useState(false);
	const [isError] = useState(false);

	useEffect(() => {
		DataStore.update(async (s) => {
			// Authentication
			s.Authentication.username =
				(await PersistenceService.getUnsecured('username')) ?? '';
			const a = await PersistenceService.getSecured('auth');
			const r = await PersistenceService.getSecured('refresh');

			if (a && r) {
				s.Authentication.isAuthenticated = true;
				s.Authentication.accessToken = a;
				s.Authentication.refreshToken = r;
			} else {
				s.Authentication.isAuthenticated = false;
			}
		});
	}, []);

	return { isLoading, isError } as const;
};

export default useLoader;
