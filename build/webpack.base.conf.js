var path = require('path')
var webpack = require('webpack')
var version = require('../package.json').version

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const srcAndExample = [
  resolve('src'),
  resolve('node_modules')
]

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main',
  },
  output: {
    path: resolve('dist'),
    publicPath: process.env.NODE_ENV === 'production'
      ? 'static.baidu.com/assets/' // 静态资源线上路径
      : '/',
    filename: '[name].js',
    chunkFilename: '[name].[chunk].js'
  },
  resolve: {
    extensions: ['.js', '.json'], // 让webpack解析这些文件时，不需要写后缀，如require('../main')
    alias: {    // 让webpack遇到包含src的路径是，去当前项目的src/下面去查找
      'src': resolve('src'),
      'common': resolve('src/common'),
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader:'html-loader',
        options:{
          attrs: [':data-src']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [  // 告诉webpack 如果 引用的资源在下面的路径中，需要使用babel-loader处理
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: srcAndExample,
        options: {
          limit: 1,
          name: 'dist/img/[name].[ext]'  //这里是url-loader 的具体配置项，可以参考对应loader的wiki
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 字体文件可能在css中被依赖，也需要配置loader
        loader: 'url-loader',
        include: srcAndExample, 
        options: {
          limit: 10000,
          name: 'dist/fonts/[name].[hash:7].[ext]'
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
