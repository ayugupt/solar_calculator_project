const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const webpack = require('webpack')

const pages = fs.readdirSync(path.join(__dirname, "./src/pages"), {withFileTypes: true}).filter(dirent => dirent.isFile()).map(dirent => dirent.name.split('.')[0])

let entryObj = {global:[path.join(__dirname, "./src/scripts/index.js"), 'webpack-hot-middleware/client', 'regenerator-runtime/runtime.js']}
for(dir of pages){
  entryObj[`${dir}`] = path.join(__dirname, `./src/scripts/${dir}/index.js`)
}

function returnHtmlPlugins(files){
  li = [];
  for(let file of files){
    li.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, `./src/pages/${file}.html`),
      filename: path.join(__dirname, `./public/pages/${file}.html`),
      chunks: ['global', `${file}`]
    }));
  }
  return li;
}

let plugins = returnHtmlPlugins(pages);
plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: entryObj,
    output: {
        path: path.resolve(__dirname, "./public/scripts"),
        filename: "[name]/[name].bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
          {
            test: /\.?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.?css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.?csv$/,
            loader: 'csv-loader',
            options: {
              dynamicTyping: true,
              header: true,
              skipEmptyLines: true
            }
          },
        ]
      },
    plugins: plugins,
    optimization: {
      runtimeChunk: 'single'
    },

}
