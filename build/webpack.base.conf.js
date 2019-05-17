var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var version = require('../package.json').version

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var devConfig = {
    env: require('./dev.env'),
    port: 8081,
    autoOpenBrowser: true,
    assetsSubDirectory: 'icon',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

const srcAndExample = [
  resolve('src'),
  resolve('mock'),
  resolve('example'),
  resolve('node_modules/@didi'),
  resolve('node_modules/didi-store')
]

module.exports = {
  output: {
    path: config.build.assetsRoot,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'pop': resolve('src/pop'),
      'core': resolve('src/core'),
      'config': resolve('src/config'),
      'async': resolve('src/async'),
      'common': resolve('src/common'),
      'oauth': resolve('src/oauth'),
      'language': resolve('src/language'),
      'components': resolve('src/components'),
      'private-api': resolve('src/private-api'),
      'public-api': resolve('src/public-api')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: srcAndExample,
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.html$/,
        use: [
          '@didi/template-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: [':data-src']
            }
          }]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: srcAndExample,
        query: {
          plugins: [
            [require('babel-plugin-transform-modules'), {
              "@didi/didi-sdk": {
                "transform": function(importName) {
                  const folderName = importName.replace(/([A-Z])/g,"-$1").toLowerCase()
                  return "@didi/didi-sdk/src/global-api/" + folderName;
                },
                "preventFullImport": true
              },
              "@didi/utils": {
                "transform": function(importName) {
                  return "@didi/utils/src/" + importName.toLowerCase() + "/index";
                },
                "preventFullImport": true
              }
            }]
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: srcAndExample,
        options: {
          limit: 1,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        include: srcAndExample,
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version)
    })
  ]
}
