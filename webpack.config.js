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
      // 匹配以.css结尾的文件后用style-loader和css-loader去处理
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.(jpg|png|gif|jpeg|bmp)$/, use: ['url-loader?limit=500000']} ,
      {test: /\.(eot|svg|ttf|woff|woff2)$/, use: ['url-loader']},
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
    ]
  }
};