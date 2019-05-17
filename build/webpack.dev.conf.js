var version = require('../package.json').version
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var entry = {
  app: './src/index.js'
}
// add hot-reload related smsCode to entry chunks
Object.keys(entry).forEach(function (name) {
  entry[name] = ['./build/dev-client'].concat(entry[name])
})

module.exports = merge(baseWebpackConfig, {
  entry: entry,
  module: {
    rules: utils.styleLoaders({ sourceMap: true })
  },
  // eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: 'localhost',
    port: '3000',
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'development',
      __VERSION__: JSON.stringify(version)
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
