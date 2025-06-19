import { jest } from '@jest/globals';

export const localStorageMock = (function () {
	let store: Record<string, string> = {};

	return {
		getItem: jest.fn((key: string) => store[key] || null),
		setItem: jest.fn((key: string, value: string) => (store[key] = value.toString())),
		removeItem: jest.fn((key: string) => delete store[key]),
		clear: jest.fn(() => {
			store = {};
		}),
		getStore: () => ({ ...store }),
		reset: (initialStore: Record<string, string> = {}) => {
			store = { ...initialStore };
		},
	};
})();
 