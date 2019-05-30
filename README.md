## 从0搭建了一个现代的前端开发环境
不依赖任何框架，在文章的末尾，会额外提供vue或者react相关的配置，但这并不是这篇文章的重点。

## 开始之前
使用工具： vscode、vscode debugger
API: console.log

工程化的核心之一就是分模块管理，webpack应运而生，使用webpack搭建前端环境需要安装的最基础npm包有：
+ webpack-dev-server， 用来启动开发环境，在webpack-dev-server还没有推出之前，一些早期的项目使用express并使用中间件的方式来实现开发模式，webpack-dev-server 集成了express中相似功能的代码，并通过命令行工具+ 配置的方式提供使用。
+ 各种loader，主要包括.js，.html, .css(或者css预处理语言stylus、less、sass等)，下面将一一介绍。
+ 各种plugins：主要包括有 html-webpack-plugins,UglifyJsPlugin, MiniCssExtractPlugin等，下面一一介绍

### STEP1： webpack篇
在webpack的配置中，一般将和文件loader、通用plugin相关的配置单独抽离出来，作为base conf，另外将和代码环境相关的抽离成dev.conf 或者build.conf，如果base conf中需要通过代码环境来配置一些路径，则使用nodejs的全局变量process.NODE_ENV来定义。

1) 运行npm i webpack webpack-dev-server html-loader css-loader babel-loader --save-dev
安装完成后，分别添加npm script，让脚本可以通过npm 跑起来：

```js
// package.json
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --mode development",
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config build/webpack.build.conf.js"
  },
```
注意一下，dev的时候是可以直接使用webpack-dev-server来启动的，这里的三个参数，在webpack-dev-server里分别有解释，一般至少需要这三个参数，最后一个--mode，也可以添加到配置文件中来指定。

2）创建webpack.base.conf.js，配置webpack基础配置
配置entry、output、css-loader等，这部分只能参考文档一步步的配置。
+ entry: 入口，告诉webpack从这个文件开始分析依赖，注意这里如果写相对路径的话，将会针对于webpack当前工作的context进行查找，指定了context为工程目录，就不应该再向上查找了。

3) 创建webpack.dev.conf.js，主要配置开发server，以及对样式资源的特殊处理

4) 创建webpack.build.conf.js，主要配置build配置，build配置为生产环境配置，需要配置与性能优化相关的插件

5）边跑demo变debug
跑demo的过程踩了很多坑，不过大部分是因为配置项没有按照要求来写（这里吐槽一下，各种插件的文档质量真的参差不齐。。）



下面记录踩坑过程，也许能帮到你：
`CASE1：` LoaderOptionsPlugin 提示loader api不合法，并提示了一个mode的配置，详细报错信息如下：

```base
configuration has an unknown property 'mode'. These properties are valid:...
```

由于webpack的文档实在太长并且细节很多，因此，刚开始我并没有意识到这个问题是webpack的不同版本导致的。
于是从源码中直接debug，在node_modules中找到webpack-dev-server，发现执行`webpack(config)`时，这里的config 已经被添加了一个 `mode: 'development'`属性！ 顺着这个思路，发现在传入config到webpack之前，webpack-dev-server会合并一个默认配置，在这里添加了一个default mode：

```js
// node_modules/webpack-dev-server/lib/utils/createConfig.js
firstWpOpt.mode = defaultTo(firstWpOpt.mode, 'development');

```

这样说来，应该是没有问题的，不过既然webpack 抛出了合格错误，说明这个config在当前的程序中没有被识别，于是翻出文档，发现当前自己使用的webpack是全局安装的3.12.1的版本，mode是4.x的属性，于是卸载全局并重装4.x的webpack，case 解决了

`CASE2`  启动dev-server，发现提示validate error，并指出不要添加多余的配置（但是没有指出哪些配置是多余的。。）

还是人肉翻源码，找到了webpack校验option的地方：

```js
// node_modules/schema-utils/src/validateOptions.js
 if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8');
    schema = JSON.parse(schema);
  }
  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }
```

检验的是根据一个schme和传入的option作比较，发现传入的不对，就抛出了多余配置的错误。。从新找到webpack dev 的config，发现有一个color配置，在webpack文档中一行小字 devServer.color 只能适用于命令行工具(CLI) 

`CASE3` extract-text-webpack-plugin 在webpack 4中无法使用，webpack官方推荐mini-css-extract-plugin

### STEP2：配置css-loader
css-loader相对复杂，因此单独拿出来分析一下，由于存在各种css预处理器，为避免选择纠结症，这里将会适配所有的css预处理语言，因为是在本机运行，编译过后都是css代码，因此对性能的影响可以忽略不计

主要有四种loader： sass-loader、less-loader、stylus-loader、postCss-loader：
+ less-loader: 兼容css的语法，在css的语法上更进一层，需要写{}
+ sass-loader: sass规范更加严格一些，不需要写{}，并且支持函数，但是需要ruby环境编译
+ stylus-loader: 功能更强大，并且语法比较简洁，对团队要求较高，并且需要良好的规范或约定
+ postCss-loader: postCss是css的一种编译语言，类似prefix的前缀需要使用postCss来添加

由于css预处理器的种类繁多，因此，配置loader时需要注意一下先后顺序:


## STEP3：babel的配置
  babel，ES6是javascript语言的未来（另一个可能是typescript，但是就目前而言typescript在大型项目中优势会比较明显，相反es6更加流行于一般的前端工程化项目）
  

配置loader 后 run build，提示需要@babel/core，于是npm i @babel/core, 新升级版本的babel遵循了`约定即配置`的思想，安装成功基本不需要额外的配置，项目就可以正常的run起来，但是如果你的项目有一些性能调优之类的问题，可能需要详细阅读babel的文档来获得帮助,这个属于具体site具体分析的问题，可以参考性能优化相关的方法论。




## loader篇
安装url-loader后报错依赖file-loader，file-loader 却没有自动安装，于是npm i file-loader

html模板中包含图片的，使用html loader 的attrs combin，添加需要让html-loader处理的tag attr，可以处理引用图片路径问题。(https://webpack.docschina.org/loaders/html-loader/)

遇到一个问题，在使用webpack的动态import时发现报错，原因是在babel转换js的阶段，已经识别了动态import，babel尝试转换这中语法，但是由于webpack原生支持使用import导入动态模块，因此这两者之前存在一个冲突。


注意：**webpack本身支持原生的模板方法import 和 export**


babel 7会尝试解析原来webpack 原生支持的dynamic 语法，导致dynamic import特性失效，如果你使用的是babel7，需要对这个进行单独的配置，配置方式是引入 `@babel/plugin-syntax-dynamic-import`

## 总结
+ 早期的express middleware来做热更新或者开发模式，已经逐渐淘汰为使用webpack-dev-server
+ 配置期间遇到问题，明确含义后可以人肉debug源码，在对比文档找出差异和错误，最后纠正。


## 参考资料
1. 再谈 CSS 预处理器，[https://efe.baidu.com/blog/revisiting-css-preprocessors/](https://efe.baidu.com/blog/revisiting-css-preprocessors/)