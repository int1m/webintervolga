const path = require('path');

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        './src/main.js',
    ],
    target: 'web',

    output: {
        path: path.resolve(__dirname, './../public'),
        assetModuleFilename: '[name].[contenthash].[ext]',
        filename: '[name].[contenthash].bundle.js',
        chunkFilename: '[id].[chunkhash].bundle.js',
        // publicPath: '/',
    },


    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            { test: /\.js$/, use: ['babel-loader'] },

            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            // template: path.resolve(__dirname, 'src/index.html'),
            template: 'src/index.html',
            // filename: 'index.html',
            // inject: false, // true, 'head'
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            // chunks: 'all',
            // excludeChunks: [],
        }),

        new CopyWebpackPlugin(
            {
                patterns: [
                    { from: 'src/assets', to: 'assets' },
                ]
            }
        ),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts'],
        alias: {
            '@': [
                path.resolve(__dirname, 'src'),
                './src/main.js'
            ],
        },
    },
}