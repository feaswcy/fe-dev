

## 开发环境
如果使用开源社区的方案，以下三个会比较成熟
## 从0搭建了一个现代的前端开发环境
不依赖任何框架，在文章的末尾，会额外提供vue或者react相关的配置，但这并不是这篇文章的重点。

## 开始之前
使用工具： vscode debugger

### STEP1： webpack篇
工程化的核心之一就是分模块管理，webpack应运而生，使用webpack搭建前端环境需要安装的最基础npm包有：
+ webpack-dev-server， 用来启动开发环境，在webpack-dev-server还没有推出之前，一些早期的项目使用express并使用中间件的方式来实现开发模式，webpack-dev-server 集成了express中相似功能的代码，并通过命令行工具+ 配置的方式提供使用。
+ 各种loader，主要包括.js，.html, .css(或者css预处理语言stylus、less、sass等)，下面将一一介绍。
+ 各种plugins：主要包括有 html-webpack-plugins,
  
在webpack的配置中，一般将和文件loader、通用plugin相关的配置单独抽离出来，作为base conf，另外将和代码环境相关的抽离成dev.conf 或者build.conf，如果base conf中需要通过代码环境来配置一些路径，则使用nodejs的全局变量process.NODE_ENV来定义。


LoaderOptionsPlugin 提示loader api不合法，这个是webpack1 到webpack2迁移过程的一个兼容插件




直接安装webpack-dev-server之后，并不能直接启动，报错提示webpack-cli，于是安装

安装之后运行，发现报错`configuration has an unknown property 'mode'. These properties are valid:`,仔细阅读下面的提示，是跟loader 的option api相关，看了一下配置，还没有添加loader，添加了loader相关的处理后，仍然报错，查看了一下stackoverflow，感觉有可能是webpack和webpack-dev-server的版本相关问题，于是全局删除了webpack、webpack-dev-server，还是不行，rm掉node modules，从新安装，仍然报错。。

于是从源码找问题，发现webpack-dev-server自动会给config加一个mode 配置，mode配置属于webpack 4的，于是感觉webpack 的版本不对，强制npm install v4版本已上的webpack，终于ok

接下来，启动dev-server，发现提示validate error，并指出不要添加多余的配置（但是没有指出哪些配置是多余的。。），还是人肉翻源码，找到了校验的地方，检验的是根据一个schme和传入的option作比较，发现传入的不对，就抛出了多余配置的错误。。从新找到webpack dev 的config，发现有一个color配置，在webpack文档中是这么写的
`devServer.color - 只用于命令行工具(CLI) `

只能用于命令行工具。。





## STEP2：babel
  babel，ES6是javascript语言的未来（另一个可能是typescript，但是就目前而言typescript在大型项目中优势会比较明显，相反es6更加流行与一般的前端工程化项目）
+ 



## 总结
+ express middleware
+ webpack dev server （推荐）
+ vue-cli