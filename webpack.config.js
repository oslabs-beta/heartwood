const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'renderer.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { electron: '32' } }],
                '@babel/preset-react',
                ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
              ]
            }
          }
        ]
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
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    port: 8080,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000',
      },
    ],
    hot: true,
  },
};

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   // Set the mode to development by default or use NODE_ENV 
//   mode: process.env.NODE_ENV || 'development',

//   entry: './src/renderer/index.tsx',

//   target: 'electron-renderer',

//   // Specify where webpack should output the bundled files  
//   output: {
//     path: path.resolve(__dirname, 'dist/renderer'), // target folder 
//     filename: 'renderer.js', // output js file name 
//   },

//   // Define modules 
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         options: {
//           presets: ['@babel/env', '@babel/react'],
//         },
//       },
//       {
//         test: /\.(ts|tsx)$/,
//         exclude: /node_modules/,
//         use: 'ts-loader',
//       },
//       {
//         test: /\.s?css$/,
//         use: ['style-loader', 'css-loader', 'postcss-loader'],
//       },
//     ],
//   },

//   resolve: {
//     extensions: ['.js', '.jsx', '.ts', '.tsx'],
//   },

//   // Configure plugins 
//   plugins: [
//     // Generate an HTML file that includes all webpack bundles 
//     new HtmlWebpackPlugin({
//       template: path.join(__dirname, 'public', 'index.html'), 
//     }),
//   ],

//   // Configure the development server  
//   devServer: {
//     // serve static files from the 'dist' directory 
//     static: {
//       directory: path.resolve(__dirname, 'public'),
//     },
//     // Set the port for the dev server 
//     port: 8080,
//     // Configure proxy for API reques
//     proxy: [
//       {
//         context: ['/'],
//         target: 'http://localhost:3000',
//       },
//     ],
//     hot: true, // Enables hot reloading
//   },
// }