"use strict"

const path = require('path');
const webpack = require('webpack');

const entry = {
  'lambdas/index': path.resolve(__dirname, './lambdas/main/index.js'),
}

module.exports = {
  entry,
  context: __dirname,
  externals:{
    "aws-sdk": "commonjs2 aws-sdk",
  },
  mode: 'production',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
    }),
  ],
  cache: false,
  target: 'node',
  resolve: {
    alias:{
      'aws-crt': path.resolve(__dirname, 'node_modules/aws-crt'),
    }
  },
};