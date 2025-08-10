# webpack(5.96) 和 vite(5.4.11) 
1. 安装webpack  
    初始化项目
    - npm init   
    安装webpack 和webpack-cli
    - npm i webpack webpack-cli -d  
     创建webpack的默认配置文件  
    - new-item webpack.config.js  
2. 配置文件的编写  
   ```` js 
    module.exports={
        //入口文件
        entry:{app:'./app.js'},
        //打包出口文件地址和文件名
        output:{
            //__dirname 当前文件所在目录
            path:__dirname+'/dist',
            //[name] 入口文件名
            // [hash:4]  打包文件名后缀 表示取4位哈希值
            fliename:'[name].[chunkhash:4].bundle.js'},
        //打包模式 none production development
        // development 模式下，打包文件会生成webpack 运行代码
        // production 模式下，会压缩代码
        // none 模式下，打包文件不会生成webpack 运行代码
        mode:'development'
    }
   ````
3. 编写测试文件  
    ```` js
    app.js
    // 引入app2
    import app2 from './app2'
    ((parameter)=>{
    //输出 1
    console.log(parameter)
    })(1);
    // 输出2
    app2()

    app2.js 

    export default ()=>{console.log('输出2')} 

    ````
4. 执行webpack 打包命令 和 添加package.json "scripts" 
   - npx webpack build  
    执行后会生成打包文件夹dist/app.bundle.js
   - 添加package.json "scripts"  
   "build":"npx webpack build"
5. 添加module (babel)module  **处理引入的内容**
   -  安装 babel @babel/core的核心库 babel-loader的webpack的loader @babel/preset-env的转译规则
   npm install  @babel/core babel-loader @babel/preset-env -d
   ```` js
    module:{
        rules[    
        test:/\js$/,
        use:{
            loader:'babel-loader',
        }]
    }
   ````
6. 添加plugin插件  
   ````js
   const example =require('example')
   //省略中间代码
    plugin:[
        new example()
    ]
   ````
7. 使用eslint  
安装eslint
- npm init @eslint/config@latest  
配置eslint
```javascript
    import globals from "globals";
    import pluginJs from "@eslint/js";  
     /** @type {import('eslint').Linter.Config[]} */  
    export default [  
    //eslint环境 目前是浏览器环境
    {languageOptions: { globals: globals.browser }},  
    // eslint推荐的规则所有规则都会被启动
    pluginJs.configs.recommended,  
    {  
     // 检查的文件  
        files: ["src/**/*.js"],  
        // 忽略的文件  
        ignores: ["**/*.config.js","webpack.config.js"],  
     // **规则**  
        rules:{  
       'no-console': 1,  
       semi: "error",
     }  
    },  
    ];   

```   
检查eslint配置是否正确  
- npm init @eslint/config@latest  
运行eslint  
- npx eslint 
忽略检查小技巧
一行忽略,注释放在忽略行的上面
- // eslint-disable-line
多行忽略,包裹忽略的代码
- /* eslint-disable */  
被忽略的代码
- /* eslint-enable */
忽略整个文件,放在文件顶部
- /* eslint-disable */  
8. 处理css  
   安装loader 
   //css-loader 解析css文件
   //style-loader 将css插入到html中
   //mini-css-extract-plugin 抽离css到一个文件
   //ss-minimizer-webpack-plugin 压缩css
   - npm i style-loader css-loader mini-css-extract-plugin css-minimizer-webpack-plugin -d
   配置loader
```js
  module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                }
            },
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,'style-loader','css-loader']
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin(
        {filename:'[name].css'}
        ),
        new cssminimizerwebpackplugin()
     ]
```
9.处理HTML  
安装html-webpack-plugin
- npm i html-webpack-plugin -d
- 添加html模板 index.html  
- 配置html-webpack-plugin
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
    plugins:[
        new HtmlWebpackPlugin({
            template:'./index.html',
            filename:'index.html',
            /* chunks:['app'] */
        })
     ]
```
10.代码分割  
+ 单入口的问题所有代码在一个文件里，这样会导致代码过大，所以需要把一些不是马上用到的代码拆分出来，这样来加块首屏速度
+ 多路口的主要问题是重复加载同一段逻辑代码  
  optimization配置   
```js
    optimization:{
        splitChunks:{
            chunks:'all',//all,async,initial
            cacheGroups:{
                vendor:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'vendor',
                    minChunks:1,
                    chunks:'all',
                    priority:10
                },
                commons:{
                    name:'commons',
                    chunks:'all',
                    minSize:0,
                    minChunks:2
                }
            }
        },
        runtimeChunk:{
            name:'runtime'
        }
    }
```
11.resolve
```js
    resolve:{
        // 别名
        alias:{
            '@':__dirname+'/src'
        },
        // 可以忽略扩展名
        extensions:['.js','.css']
    }
```
## vite  
  初始化项目  
- npm init -y  
  安装vite
- npm i vite -d  
  创建vite.config.js文件
-  new-item vite.config.js  
  配置vite.config.js 
```js  
import { defineConfig } from 'vite'
export default defineConfig({
    esbuild:{}, 
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: {
            '@': 'src'
        }
    },
    build: {
        rollupOptions: {
    /*         // 单独打包成一个文件
            manualChunks: { vendor: ['vue'] },
            output:{
                // 出口文件
                chunkFileNames: 'js/[name]-[hash].js',
                // 入口文件
                entryFileNames: 'js/[name]-[hash].js',
                // 图片等静态资源
                assetFileNames: '[name]-[hash].[ext]'
            } */
        },
        // 转base 64
        assertsInlineLimit: 0
    },
    server: {},
    plugins: []
})
```
  打包
- npx vite build  
  开发服务器 
- npx vite 



