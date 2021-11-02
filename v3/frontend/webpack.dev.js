const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/',
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './src',
        watchContentBase: true,
        inline: true,
        open: true,
        compress: true,
        hot: true,
        disableHostCheck: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost/tretyakovgallery/v3',
                changeOrigin: true,
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, importLoaders: 1, modules: false },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
        ],
    },

});