
const merge = require('webpack-merge')
const baseConf = require('./webpack.base.conf')
const path =require('path')
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


// const config = {
//   env: require('./prod.env'),

//   // Paths
//   /* NEED_MODIFY: 入口 html 文件 path */
//   index: path.resolve(__dirname, '../dist/index.html'),
//   assetsRoot: path.resolve(__dirname, '../dist'),
//   assetsSubDirectory: projectName,
//   /* NEED_MODIFY: 静态资源前缀 */
//   assetsPublicPath: '//static.udache.com/common/',

//   // Source Maps
//   productionSourceMap: false,
//   devtool: '#source-map',

//   productionGzip: false,
//   productionGzipExtensions: ['js', 'css'],
//   bundleAnalyzerReport: process.env.npm_config_report
// }

function resolveDir(dir){
  return path.join(__dirname, '../', dir)
}

const webpackConfig = merge(baseConf, {
  module: {  // 告诉webpack把 css提取出来放到一个单独的文件
    // rules: utils.styleLoaders({
    //   sourceMap: config.build.productionSourceMap,
    //   extract: true,
    //   usePostCSS: true
    // })
  },
  devtool: false, // 告诉webpack在devtool展示相关debug信息
  optimization:{
    splitChunks:{
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      manifest: {
        name: 'manifest',
        minChunks: Infinity
      },
      manifest: {
        name: 'manifest',
        async: 'vendor-async',
        children: true,
        minChunks: 3
      },

    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        }
      },
      sourceMap: false,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: resolveDir('dist/css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
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
      filename: 'index.html',
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
    new BundleAnalyzerPlugin(),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        'js|css' +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
})



module.exports = webpackConfig