import packageJson from './package.json'

export default {
	input: packageJson.main,
	output: {
		file: `dist/${packageJson.name}.js`,
		format: 'iife',
		name: 'imageZoom',
	},
}
