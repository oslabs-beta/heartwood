const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/renderer/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Applies babel to .js files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/, // Apply CSS loader and inject styles
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './public/index.html',
        })
    ],
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080, // Port for the dev server
        proxy: {
            context: ['/api'],
            target: 'http://localhost:3000',
            secure: false,
        },

        open: true, // Open browser after server has been started
        hot: true, // Hot reloading
    }
};