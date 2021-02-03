import PersistenceService from '../Services/PersistenceService';
import { DataStore } from './DataStore';

// Authentication Reactions
DataStore.createReaction(
	(s) => s.Authentication,
	async (w, d, o, lw) => {
		await PersistenceService.setUnsecured('username', w.username);
		await PersistenceService.setSecured('auth', w.accessToken);
		await PersistenceService.setSecured('refresh', w.refreshToken);
	}
);
