const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const getBuildId = require('./scripts/build-id');

const NODE_ENV = process.env.NODE_ENV;
const PRODUCTION_BUILD = NODE_ENV === 'production';

// Remove (chunk)hashes from names in non-production build to stop dev-server from
// caching a new bundle every time something is changed.
const namePattern = name => PRODUCTION_BUILD ? name : name.replace(/\.\[(?:chunk)?hash\]/, '');

const config = {
    entry: 'src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: namePattern('res/[name].[chunkhash].js')
    },
    resolve: {
        modules: [ './', 'node_modules' ],
        alias: {
            'vue$': PRODUCTION_BUILD ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: PRODUCTION_BUILD
                            }
                        },
                        { loader: 'sass-loader' },
                    ]
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                }
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|otf|woff|woff2)$/,
                loader: 'file-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.template.ejs',
        }),
        new ExtractTextPlugin(namePattern('res/[name].[hash].css')),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            'process.env.BUILD_ID': JSON.stringify(getBuildId()),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};

if(PRODUCTION_BUILD) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    );

    if(process.env.BUNDLE_ANALYZER) {
        const BAP = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins.push(new BAP({
            analyzerMode: 'static',
            // Host that will be used in `server` mode to start HTTP server.
            // analyzerHost: '127.0.0.1',
            // Port that will be used in `server` mode to start HTTP server.
            // analyzerPort: 8888,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
            // Module sizes to show in report by default.
            // Should be one of `stat`, `parsed` or `gzip`.
            // See "Definitions" section for more information.
            defaultSizes: 'parsed',
            // Automatically open report in default browser
            openAnalyzer: true,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
          }));
    }

} else {
    config.devtool = 'source-map';
    config.devServer = {
        // default is 'localhost', but this is easier to demo
        host: '0.0.0.0',
        // proxy the local Instanssi server to get around CORS issues
        proxy: {
            '/': {
                target: 'http://localhost:8000',
            }
        },
        publicPath: '/kompomaatti/',
    };
}

module.exports = config;
