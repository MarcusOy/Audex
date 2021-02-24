declare module 'apollo-link-jwt';

declare let window: Window;
interface Window {
	require: NodeRequire;
}
