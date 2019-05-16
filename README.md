# 构建webpack

1. 新建项目，安装对应的依赖，初始化目录结构。

   ```powershell
   mkdir demo 
   cd demo
   npm init -y
   npm install webpack webpack-cli --save-dev
   ```

   配置目录结构：

   ```javascript
   -dist
   -src
     -images
     -css
     -js
     -index.html // 项目html入口
     -main.js // 项目js入口
   -package.json
   -package-lock.json
   -webpack.config.js
   ```

   新增webpack配置文件，*webpack.config.js*

   ```javascript
   const path = require('path');
   // 编译main.js 为dist/bundle.js
   module.exports = {
     entry: './src/main.js',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js'
     }
   };
   ```

2. 安装***webpack-dev-server***

   `webpack-dev-server`和`webpack`命令的区别就像运行`node`和`nodemon`的区别，用`webpack-dev-server`命令运行可以检测到我们每次代码的变化并且自动去重新编译，避免了频繁的去运行项目。

3. 在***package.json***里添加新的命令，简化操作。

   ```javascript
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "dev": "webpack-dev-server"
     },
   ```

   接下来我们就可以用 `npm run dev` 来启动项目了。

4. ***webpack-dev-server***参数配置。

   *方式1*：在`package.json`中的`script`里修改。

   ```json
   "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
   ```

   *方式2*：在`webpack.config.js`中新增`devServer`。

   ```javascript
   const path = require('path');
   
   module.exports = {
     entry: './src/main.js',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js'
     },
     // 添加配置
     devServer: {
       open: true,
       port: 3000,
       contentBase: 'src',
       hot: true
     }
   };
   ```

   *参数说明*：

   - `—open` 自动打开浏览器
   - `--port 3000` 指定端口为3000
   - `--contentBase src` 指定src为根路径，读取`src/index.html`
   - `--hot` 热重载，避免反复的重新编译`main.js`，页面无刷新更改

5. 关于***index.html***。

   这里我们的 ` <script src="bundle.js"></script>` 并不是指向的 `dist/bundle.js`，并且我们这里把dist中的这个js文件删除掉也不会影响，这是因为在src同级目录内存中生成了这个`bundle.js`，只是我们看不到而已，这样可以避免反复去访问物理磁盘中的`bundle.js`(`dist/bundle.js`)而带来的损耗。

6. 第三方***loader***。

   我们直接在`main.js`里面引用css样式文件，`import './css/index.css'` 会直接报错，这是因为webpack默认只能处理js类型的文件，无法处理非hs类型的文件，如果要处理非js类型的文件，我们需要手动去安装第三方的loader加载器。

   - 处理***css***：

     `npm i style-loader css-loader -D`

     在webpack.config.js 中配置：

     ```javascript
     const path = require('path');
     
     module.exports = {
       entry: './src/main.js',
       output: {
         path: path.resolve(__dirname, 'dist'),
         filename: 'bundle.js'
       },
       devServer: {
         open: true,
         port: 3000,
         contentBase: 'src',
         hot: true
       },
       // 配置所有第三方加载器
       module: {
         rules: [
           // 匹配以.css结尾的文件后用style-loader和css-loader去处理，从后往前去匹配，先css-loader后style-loader
           {test: /\.css$/, use: ['style-loader', 'css-loader']}
         ]
       }
     };
     ```

   - 处理***less***：

     `npm i less less-loader -D`

     在webpack.config.js 中配置：

     ```javascript
     {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']}
     ```

   - 处理***scss***：

     `npm i node-sass sass-loader -D` (注意这里是*sass*)

     在webpack.config.js 中配置：

     ```javascript
     {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']} 
     ```

     

   - 处理***image***：

     默认情况下，无法处理css文件中的url地址

     `npm i url-loader file-loader`

     在webpack.config.js 中配置：

     ```js
     {test: /\.(jpg|png|gif|jpeg|bmp)$/, use: ['url-loader']}
     ```

     *<u>Tips</u>*: 默认会将图片转为base64。可配置`limit`参数，如果图片大小大于`limit`设置的大小则不会转换为base64。(大小单位为byte)

     ```javascript
     {test: /\.(jpg|png|gif|jpeg|bmp)$/, use: ['url-loader?limit=1000']} 
     ```

   - 处理***font***：

     和图片url类似

     在webpack.config.js 中配置：

     ```js
     {test: /\.(eot|svg|ttf|woff|woff2)$/, use: ['url-loader']}
     ```

   - ***Babel***:
     在webpack中，默认只能处理部分ES6的新语法，一些更高级的语法需要借助第三方loader来处理，可以使用*Babel*来处理这些高级语法将其转换为webpack可以识别的语法。如下图中类的静态属性就需要借助*Babel*来处理。

     ```js
     class Person {
       // ERROR 此处webpack无法处理
       static info = {name: 'fy'}
     }
     ```

     一.安装*Babel*相关依赖：

     ```shell
     npm i -D babel-loader @babel/core @babel/preset-env
     npm i -D @babel/plugin-proposal-class-properties
     ```

     二.在webpack.config.js 中配置：

     ```js
     		{
             test: /\.m?js$/,
             exclude: /(node_modules|bower_components)/, // 不处理node_modules中的js
             use: {
               loader: 'babel-loader',
               options: {
                 presets: ['@babel/preset-env'],
                 plugins: ['@babel/plugin-proposal-class-properties']
               }
             }
           },
     ```

参考：[Babel参考](https://github.com/babel/babel-loader)  [webpack中文网](https://www.webpackjs.com/guides/getting-started/)

