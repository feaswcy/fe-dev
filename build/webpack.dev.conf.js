const path = require('path')
const baseConf = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolveDir(dir){
  return path.join(__dirname, dir)
}

const devConf = merge(baseConf, {
  module: {  // dev模式下，告诉webpack这样处理css或者css预处理文件
    rules: [{
      test: /\.css$/,
      use: [ // sourceMap有很多bug，所以都不打开
        { loader: 'css-loader', options: { sourceMap: false } },
        { loader: 'postcss-loader', options: { sourceMap: false } }
      ]},
      {
        test: /\.stylus$/,
        use: [
          { loader: 'css-loader', options: { sourceMap: false } },
          { loader: 'postcss-loader', options: { sourceMap: false } },
          {
            loader: 'stylus-loader',
            options: { 'resolve url': true, sourceMap: false }
          }
        ]
      }
    ]
  },
  // 开发模式下，sourceMap的类型会影响到构建速度，https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
  devtool: 'eval-source-map', 

  // 配置dev-server
  devServer: {
    contentBase: resolveDir('../'),
    compress: true,
    hot: true,
    // color: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1'
    ],
    host: '127.0.0.1',
    port: '8080',
    open: true,
    publicPath: '/',
    quiet: true, // necessary for FriendlyErrorsPlugin
    historyApiFallback: true,
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env': 'development'
    }),
    // 告诉webpack开发中启用热更新
    new webpack.HotModuleReplacementPlugin(),
    // 在开启HMR时，告诉webpack展示出不同module的路径
    new webpack.NamedModulesPlugin(),
    // 告诉webpack出现错误时不要退出，并且跳过输出阶段
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = devConf