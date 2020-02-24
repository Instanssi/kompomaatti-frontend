const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const getBuildId = require('./scripts/build-id');

const NODE_ENV = process.env.NODE_ENV;
const PRODUCTION_BUILD = NODE_ENV === 'production';

// Remove (chunk)hashes from names in non-production build to stop dev-server from
// caching a new bundle every time something is changed.
const namePattern = name => PRODUCTION_BUILD ? name : name.replace(/\.\[(?:chunk)?hash\]/, '');

const config = {
    mode: PRODUCTION_BUILD ? 'production' : 'development',
    entry: 'src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: namePattern('res/[name].[chunkhash].js'),
        publicPath: '/kompomaatti/',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            'src': path.resolve(process.cwd(), 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        // This works around some issues with import semantics.
                        useBabel: true,
                        useCache: true,
                    }
                }
            },
            {
                test: /\.scss$/,
                // Pass SCSS through the usual loader chain (last is applied first).
                use: getStyleLoaders([
                    'css-loader',
                    'postcss-loader',
                    { loader: 'sass-loader', options: { implementation: require('sass'), }, },
                ])
            },
            {
                test: /\.css$/,
                // Pass SCSS through the usual loader chain (last is applied first).
                use: getStyleLoaders([
                    'css-loader',
                    'postcss-loader',
                ])
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                }
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|otf|woff|woff2|eot)$/,
                loader: 'file-loader',
                options: {
                    // Path prefix in deployment environment.
                    publicPath: '/kompomaatti/res/',
                    // Relative path in the build directory to save files to.
                    outputPath: 'res/'
                }
            }
        ]
    },
    plugins: [
        // Generate a templated index.html file for the project, automatically including
        // any entry bundles emitted by Webpack as <script/> tags.
        new HtmlWebpackPlugin({
            template: 'src/index.template.ejs',
        }),
        // Emit a manifest.json with some basic info about the app.
        new WebpackPwaManifest({
            name: 'Kompomaatti',
            short_name: 'Kompomaatti',
            description: 'Instanssi.org compo management system.',
            // This wasn't very readable in Android Chrome. Let's try something else.
            // theme_color: '#00a8ff',
            // Let's not go standalone until the app's been tested like that.
            display: 'browser',
            icons: [
                {
                    src: path.resolve('src/favicon.png'),
                    sizes: [32, 64, 128, 192, 256],
                }
            ]
        }),
        // Emit all extracted text (CSS) into a single file.
        // This lets it get loaded in parallel with the JS load/parse
        new MiniCssExtractPlugin({
            filename: namePattern('res/[name].[hash].css'),
            chunkfilename: namePattern('[id].[chunkhash].css'),
        }),
        // DefinePlugin can replace content in the loaded JS modules with new text.
        // Note that in production builds, JS minification will remove any code that is put
        // behind compile-time false condition expressions (e.g. comparisons with NODE_ENV).
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            'process.env.BUILD_ID': JSON.stringify(getBuildId()),
        }),
        // Ignore moment locales by default.
        // Without this, importing 'moment' imports _every_ locale file too.
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};

/**
 * Build the final chain of CSS loaders from a list like ['css-loader', 'sass-loader'].
 *
 * In production builds, we build the CSS into a separate bundle to load them more
 * efficiently. Disabled in development environments because of terminal spam.
 */
function getStyleLoaders(cssLoaders) {
    // Package and load CSS separately in production builds.
    // In development mode, just use style-loader (= CSS in a JS module).
    const loader = PRODUCTION_BUILD ? MiniCssExtractPlugin.loader : 'style-loader';
    return [loader, ...cssLoaders];
}

if(PRODUCTION_BUILD) {
    config.plugins.push(
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    );

    if(process.env.BUNDLE_ANALYZER) {
        // Print out a visualization of what's making the bundle so big.
        const BAP = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins.push(new BAP({
            analyzerMode: 'static',
        }));
    }
} else {
    config.devtool = 'source-map';
    config.devServer = {
        // default is 'localhost', but this is easier to demo
        host: '0.0.0.0',
        // proxy the local Instanssi server to get around CORS issues
        proxy: {
            '!/kompomaatti/**': {
                target: process.env.INSTANSSI_URL || 'http://localhost:8000',
                secure: false,
                changeOrigin: true,
            }
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/kompomaatti/,
                    to: function(context) {
                        // Great. The history fallback doesn't seem to handle public paths.
                        // Handle resource paths manually then.
                        const { pathname } = context.parsedUrl;
                        const resIndex = pathname.indexOf('/res/');
                        if(resIndex < 0) {
                            return '/kompomaatti/index.html';
                        } else {
                            const path = '/kompomaatti' + pathname.slice(resIndex);
                            return path;
                        }
                    },
                },
            ]
        },
        // Emulate actual deployment env
        publicPath: '/kompomaatti/',
    };
}

module.exports = config;
