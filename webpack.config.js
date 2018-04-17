const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const entry = require("./webpack_config/entry_webpack.js");
const webpack = require('webpack');
// console.log("_________"+entry.path);
module.exports={
    devtool: 'eval-source-map',
    mode: 'development',
    watch: true,
    //context: path.resolve(__dirname, './src'),
    //入口文件的配置项
    entry:{
        "ss/aa": './src/entry.js',
        jquery:'jquery',
        //这里我们又引入了一个入口文件
        entry2:'./src/entry2.js'
    },
    //出口文件的配置项
    output:{
        path:path.resolve(__dirname,'dist'),
        //打包的文件名称
        filename:'[name].js'
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules:[
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            },
            {
               test:/\.(png|jpg|gif)/ ,
               use:[{
                   loader:'url-loader',
                   options:{
                       limit:500000
                   },
                   //outputPath:'images/',
               }]
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "less-loader"
                        }],
                        // use style-loader in development
                        fallback: "style-loader"
                    })
            },
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
                new uglify(),
                new htmlPlugin({
                    minify:{
                        removeAttributeQuotes:true
                    },
                    hash:true,
                    template:'./src/index.html'
                }),
                new extractTextPlugin("/css/indexaa.css"),
                new webpack.ProvidePlugin({
                    $:"jquery"
                }),

    ],
    optimization:{
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },        
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        clientLogLevel: 'warning',
        contentBase:path.resolve(__dirname,'dist'),
        publicPath: "/dist/",
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717,
        open:false,
        historyApiFallback: {
          rewrites: [
            { from: /.*/, to: path.posix.join('/', 'index.html') },
          ],
        },
        overlay:{ warnings: false, errors: true },
        watchOptions: {
            //检测修改的时间，以毫秒为单位
            poll:1000, 
            //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
            aggregateTimeout:500, 
            //不监听的目录
            ignored:/node_modules/, 
        }
    }
}
