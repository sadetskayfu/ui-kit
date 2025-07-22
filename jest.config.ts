export default {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json' }], // Обработка .ts и .tsx файлов
		'^.+\\.jsx?$': 'babel-jest', // Обработка .js и .jsx файлов
		'.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub', // Обработка стилей и изображений
	},
	moduleNameMapper: {
		'\\.(css|scss)$': 'identity-obj-proxy', // Мокаем CSS-модули
		'\\.(gif|ttf|eot|svg|png)$': '<rootDir>/shared/test/__mocks__/file-mock.ts', // Мокаем файлы
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	verbose: true,
	extensionsToTreatAsEsm: ['.ts', '.tsx'], // Указываем, что .ts/.tsx — это ESM
};
