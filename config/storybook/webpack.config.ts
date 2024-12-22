import path from 'path'
import { Configuration, RuleSetRule } from 'webpack'
import { BuildPaths } from 'config/build/types/config'
import { buildCssLoader } from 'config/build/loaders/buildCssLoader'
import { buildSvgLoader } from 'config/build/loaders/buildSvgLoader'

export default ({ config }: { config: Configuration }) => {
	const paths: BuildPaths = {
		entry: '',
		output: '',
		html: '',
		src: path.resolve(__dirname, '..', '..', 'src'),
	}

	// add absolute imports with alias
	
	config!.resolve!.alias = {
		...config?.resolve?.alias,
		'@': paths.src,
	}

	// add css module
	
	config!.module!.rules!.push(buildCssLoader(true))

	// create new loaders, without svg
	// @ts-ignore
	const rules = config.module.rules.map((rule: RuleSetRule) => {
		if (/svg/.test(rule.test as string)) {
			return {
				...rule,
				test: /\.(ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
			}
		}
		return rule
	})

	// add svg loader
	rules.push(buildSvgLoader())
	
	config!.module!.rules = rules

	return config
}
