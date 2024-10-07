const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Set the mode to development by default or use NODE_ENV 
  mode: process.env.NODE_ENV || 'development',

  // Define the main entry points for the app
  entry: './src/renderer/index.js',

  // Specify where webpack should output the bundled files  
  output: {
    path: path.resolve(__dirname, 'dist'), // target folder 
    filename: 'bundle.js', // output js file name 
  },

  // Define modules 
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  // Configure plugins 
  plugins: [
    // Generate an HTML file that includes all webpack bundles 
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'), // use index.html in a public folder as a template 
    }),
  ],

  // Configure the development server  
  devServer: {
    // serve static files from the 'dist' directory 
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    // Set the port for the dev server 
    port: 8080,
    // Configure proxy for API reques
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000',
      },
    ],
    hot: true, // Enables hot reloading
  },
}