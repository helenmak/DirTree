const webpack        = require('webpack');
const path           = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    
    devtool: 'eval-source-map',
    
    entry: [
        './src/index.js'
    ],
    
    output: {
        path      : path.join(__dirname, 'dist'),
        filename  : 'build.js',
        publicPath: '/'
    },
    
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000,
        hot: true,
        publicPath: '/',
        historyApiFallback: true
    },
    
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 2
                        }
                    }
                ]
            },
            {
                test: /\.(otf|eot|ttf|ttc|woff|jpe?g|png|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 24000
                        }
                        
                    }
                ]
            }
        ]
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyPlugin([
            {
                from: path.join(__dirname, 'src/sources/'),
                to: path.join(__dirname, 'dist/sources')
            },
        ]),
        new webpack.HotModuleReplacementPlugin()
    ]
};
