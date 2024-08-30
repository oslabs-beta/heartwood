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
        // use babel-loader for JS and JSX files 
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
      {
        // use style-loader, css-loader for CSS 
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
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
    // open: true, // Automatically opens the browser  
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  // Tell webpack this is electron renderer process 
  // target: 'electron-renderer',

}



// module.exports = {
//     mode: process.env.NODE_ENV || 'development',
//     entry: ['./src/renderer/index.js'],
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'dist'),
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/, // Applies babel to .js files
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                 },
//             },
//             {
//                 test: /\.css$/, // Apply CSS loader and inject styles
//                 use: ['style-loader', 'css-loader'],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             title: 'Development',
//             template: './public/index.html',
//         })
//     ],
//     devServer: {
//         static: path.resolve(__dirname, 'dist'),
//         port: 8080, // Port for the dev server
//         proxy: {
//             context: ['/api'],
//             target: 'http://localhost:3000',
//             secure: false,
//         },

//         open: true, // Open browser after server has been started
//         hot: true, // Hot reloading
//     }
// };


  