declare module 'apollo-link-jwt';
declare module 'electron-push-receiver/src/constants';
declare let window: Window;
interface Window {
	require: NodeRequire;
}
