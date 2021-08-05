/* eslint-disable no-undef */
const os = require('os');

//#region PlatformFunctions
const platforms = {
	WINDOWS: 'WINDOWS',
	MAC: 'MAC',
	LINUX: 'LINUX',
	SUN: 'SUN',
	OPENBSD: 'OPENBSD',
	ANDROID: 'ANDROID',
	AIX: 'AIX',
};

const platformNames = {
	win32: platforms.WINDOWS,
	darwin: platforms.MAC,
	linux: platforms.LINUX,
	sunos: platforms.SUN,
	openbsd: platforms.OPENBSD,
	android: platforms.ANDROID,
	aix: platforms.AIX,
};

const currentPlatform = platformNames[os.platform()];

const platformPath = (path) => {
	if (currentPlatform == platformNames.win32)
		return path.replaceAll('/', '\\');

	return path.replaceAll('\\', '/');
};
const normalizePath = (path) => {
	return path.replaceAll('\\', '/');
};
//#endregion

const isDev = () => {
	// return process.argv[2] == '--dev';
	return true;
};

exports.platformNames = platformNames;
exports.currentPlatform = currentPlatform;
exports.platformPath = platformPath;
exports.normalizePath = normalizePath;
exports.isDev = isDev;
