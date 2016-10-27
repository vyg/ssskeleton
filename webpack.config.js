const path = require('path');
const webpack = require('webpack')

module.exports = {
  debug: true,
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass!postcss-loader' // Run both loaders
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader?presets[]=es2015&presets[]=react'
      // }
    ]
  },
  postcss: function () {
    return [autoprefixer({
          browsers: [
                'last 1 version',
                'safari 6',
                'ie 9',
                'ios 6',
                'android 4'
          ]})
    ];
  }
}
