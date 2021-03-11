/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
import { DataStore } from '../DataStore/DataStore';
import PersistenceService from './PersistenceService';

interface UserData {
	username: string;
	authToken: string;
	refreshToken: string;
}

class IdentityService {
	static setUser(u: UserData) {
		DataStore.update((s) => {
			s.Authentication.username = u.username;
			s.Authentication.accessToken = u.authToken;
			s.Authentication.refreshToken = u.refreshToken;
			s.Authentication.isAuthenticated = true;
		});
		PersistenceService.setUnsecured('username', u.username);
		PersistenceService.setSecured('auth', u.authToken);
		PersistenceService.setSecured('refresh', u.refreshToken);
	}
	static logOut() {
		DataStore.update((s) => {
			s.Authentication.accessToken = '';
			s.Authentication.refreshToken = '';
			s.Authentication.isAuthenticated = false;
		});
		PersistenceService.setSecured('auth', '');
		PersistenceService.setSecured('refresh', '');
	}
}

export default IdentityService;