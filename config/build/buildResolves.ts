import { ResolveOptions } from 'webpack'
import { BuildPaths } from './types/config'

export function buildResolves(paths: BuildPaths): ResolveOptions {
	return {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
		//mainFiles: ['index.ts'],
		alias: {
			'@': paths.src, // add absolute imports
		},
	}
}
