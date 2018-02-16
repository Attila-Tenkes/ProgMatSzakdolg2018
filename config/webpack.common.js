var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var $ = require('jquery');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.scss'],
    alias:{
      "jquery-ui":"jquery-ui-dist",
      modules:"../node_modules"
      }
   },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.scss$/,
        exclude: helpers.root('src', 'app'),
        //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
        use: ExtractTextPlugin.extract({
         fallback: "style-loader",
         use: "css-loader!sass-loader",
       })
      },
      { test: /\.min.css$/, loader: "style-loader!css-loader" },
     {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      },
      //devextreme miatt
      { test: /dx.\w*\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(ttf|eot|woff)$/, loader: "file-loader?name=/[name].[ext]" }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.ProvidePlugin({
      "$":"jquery",
      "jQuery":"jquery",
      "window.jQuery":"jquery"
    }),
    ]
};
