import webpack from 'webpack'
import { BuildOptions } from './types/config'
import { buildLoaders } from './buildLoaders'
import { buildPlugins } from './buildPlugins'
import { buildResolves } from './buildResolves'
import { buildDevServer } from './buildDevServer'

export function buildWebpackConfig(
	options: BuildOptions
): webpack.Configuration {
	const { mode, paths, isDev } = options

	return {
		mode: mode,
		entry: {
			bundle: paths.entry,
		},
		output: {
			path: paths.output,
			filename: '[name].[contenthash].js',
			clean: true,
		},
		module: {
			rules: buildLoaders(isDev),
		},
		plugins: buildPlugins(options),
		resolve: buildResolves(paths),
		devtool: isDev ? 'inline-source-map' : undefined,
		devServer: isDev ? buildDevServer(options) : undefined,
	}
}
