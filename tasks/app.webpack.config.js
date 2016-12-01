const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootPath = require('app-root-path');
const fs = require('fs');

const mainConfig = JSON.parse(fs.readFileSync(rootPath + '/config/main.config.json', 'utf8')); 
const mainDir = rootPath + mainConfig.fe_app_cwd;

module.exports = {
	metadata: {
		title: mainConfig.site_title
	},

	entry: {
		polyfills: `${mainDir}/polyfills.ts`,
		vendor: `${mainDir}/vendor.ts`,
		main: `${mainDir}/main.ts`
	},

	output: {
		path: rootPath + mainConfig.fe_app_dest,
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].map',
		chunkFilename: '[id].chunk.js'
	},

	resolve: {
		extensions: ['', '.ts', '.js', '.css', '.styl'],
		root: mainDir,
		modulesDirectories: ['node_modules'],
	},

	module: {
		preLoaders: [],
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts',
				exclude: [/\.(spec|e2e)\.ts$/]
			},
			{
				test: /\.(jade|pug)$/,
				loader: 'pug-html-loader?doctype=html'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.scss$/,
				loader: 'css!sass'
			},
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/octet-stream"
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/svg+xml"
			},
			{
				test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/png"
			},
			{
				test: /\.json$/,
				loader: "json"
			},
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['vendor', 'polyfills']
		}),
		new HtmlWebpackPlugin({
			template: mainDir + '/index.html',
			chunksSortMode: 'dependency'
		})
	]
};