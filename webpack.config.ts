import { Configuration } from 'webpack'
import { buildWebpackConfig } from './config/build/buildWebpackConfig'
import { BuildEnv, BuildPaths } from './config/build/types/config'
import path from 'path'

export default function (env: BuildEnv): Configuration {
	const paths: BuildPaths = {
		entry: path.resolve(__dirname, 'src', 'index.tsx'),
		output: path.resolve(__dirname, 'build'),
		html: path.resolve(__dirname, 'public', 'index.html'),
		src: path.resolve(__dirname, 'src'),
	}

	const mode = env.mode || 'development'
	const PORT = env.port || 3000
	const apiUrl = env.apiUrl || 'http://localhost:3000'

	const isDev = mode === 'development'

	const config = buildWebpackConfig({
		mode: mode,
		paths,
		isDev,
		port: PORT,
		apiUrl: apiUrl
	})

	return config
}
