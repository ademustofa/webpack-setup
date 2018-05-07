const path = require('path'),
      glob = require('glob'),
      webpack = require('webpack'),
      node_dir = __dirname + '/node_modules',
      CleanWebpackPlugin = require('clean-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MinifyPlugin = require("babel-minify-webpack-plugin"),
      ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({ filename: './assets/css/app.css' });

const config = {

  // absolute path for project root with the 'src' folder
  context: path.resolve(__dirname, 'src'),

  entry: ['babel-polyfill', './app.js'], 
  // {
  //   app: './app.js',
  //   vandor: ['react', 'react-dom', 'react-router-dom'],
  // },

  output: {
    // absolute path declaration
    path: path.resolve(__dirname, 'dist'),
    filename: './assets/js/[name].bundle.js'
  },

  module: {
    rules: [

      // babel-loader with 'env' preset
      { 
        test: /\.js$/, 
        include: /src/, 
        exclude: /node_modules/, 
        use: { 
          loader: "babel-loader", 
          options: { 
            presets: ['env', 'react', 'es2015'] 
          } 
        } 
      },
      // html-loader
      { test: /\.html$/, use: ['html-loader'] },
      // sass-loader with sourceMap activated
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                "includePaths": ['node_modules', 'node_modules/@material/*']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      // file-loader(for images)     
      { test: /\.(jpg|png|gif|svg)$/, use: [ { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './assets/media/' } } ] },
       // file-loader(for fonts)
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] }
    ]
  },

  resolve: {
      alias: {
        jquery: "jquery/src/jquery"
    }
  },

  plugins: [
    // cleaning up only 'dist' folder
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    extractPlugin
  ],

  

  devServer: {
    // static files served from here
    contentBase: path.resolve(__dirname, "./dist/assets/media"),
    compress: true,
    // open app in localhost:2000
    port: 4000,
    stats: 'errors-only',
    open: true
  },

  devtool: 'inline-source-map'

};

module.exports = config;
