
const merge = require('webpack-merge')
const baseConf = require('./webpack.base.conf')
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin') issue:https://github.com/webpack/webpack/issues/5858

const webpackConfig = merge(baseConf, {
  mode: 'production',
  output:{
    publicPath: '/dist/'
  },
  module: {  // 告诉webpack把 css提取出来放到一个单独的文件
    // rules: utils.styleLoaders({
    //   sourceMap: config.build.productionSourceMap,
    //   extract: true,
    //   usePostCSS: true
    // })
    rules: [{
      test: /\.css$/,
      use: [ // sourceMap有很多bug，所以都不打开
        { loader: 'css-loader', options: { sourceMap: false } },
        // { loader: 'postcss-loader', options: { sourceMap: false } }
      ]
    },
    {
      test: /\.stylus$/,
      use: [
        { loader: 'css-loader', options: { sourceMap: false } },
        // { loader: 'postcss-loader', options: { sourceMap: false } },
        {
          loader: 'stylus-loader',
          options: { 'resolve url': true, sourceMap: false }
        }
      ]
    }
    ]
  },
  devtool: false, // 告诉webpack在devtool展示相关debug信息
  optimization:{
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ],
    splitChunks:{
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups:{
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        manifest: {
          name: 'manifest',
          minChunks: Infinity
        },
        // manifest: {
        //   name: 'manifest',
        //   async: 'vendor-async',
        //   children: true,
        //   minChunks: 3
        // },
      }
    }
  },
  plugins: [
    // webpack 4 默认配置，不在需要

    // new webpack.DefinePlugin({
    //   'process.env': 'production'
    // }),

    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       // warnings: false,
    //       drop_console: true,
    //       drop_debugger: true
    //     }
    //   },
    //   sourceMap: false,
    //   parallel: true
    // }),

    // ExtractTextPlugin 在webpack 4中已被 MiniCssExtractPlugin 取代
    // new ExtractTextPlugin({
    //   filename: resolveDir('dist/css/[name].[contenthash].css'),
    //   // set the following option to `true` if you want to extract CSS from
    //   // codesplit chunks into this main css file as well.
    //   // This will result in *all* of your app's CSS being loaded upfront.
    //   allChunks: false,
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'dist/css/[name].[contenthash].css',
      chunkFilename: '[id].[hash].css',
      allChunks: false,
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', // 告诉HtmlWebpackPlugin 把引用script的html字符串写入这个文件
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // new BundleAnalyzerPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',  // 注意之前是asset属性，现在是filename
      test: new RegExp(
        '\\.(js|css)$'
      ),
      threshold: 10240, // 只有超过10140字节的才会被压缩
      minRatio: 0.8
    })
  ]
})

module.exports = webpackConfig
