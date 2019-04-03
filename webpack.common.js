require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const appDir = path.resolve(__dirname, 'build');

const config = {
  entry: './src/main.jsx',
  output: {
    path: appDir,
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'file-loader'
      },
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { 
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'Mapping Inequality',
      filename: 'index.html',
      appMountId: 'app-container',
      links: [
        'https://fonts.googleapis.com/css?family=Merriweather:300|Lato:400,100,300|Lora:100,400,400i|PT+Sans:400',
        '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/leaflet.css'
      ],
      scripts: ['https://cartodb-libs.global.ssl.fastly.net/cartodb.js/v3/3.15/cartodb.core.js'],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          property: 'og:url',
          content: 'https://dsl.richmond.edu/panorama/congress/'
        },
        {
          property: 'og:title',
          content: 'Electing the House of Representatives'
        },
        {
          property: 'og:description',
          content: 'Maps and visualizations of House elections for nearly two centuries.'
        },
        {
          property: 'og:image',
          content: 'https://dsl.richmond.edu/panorama/congress/static/ogimage.png'
        },
        {
          property: 'og:image:width',
          content: '1200'
        },
        {
          property: 'og:image:height',
          content: '630'
        }
      ]
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: process.env.NODE_ENV === 'development'
    })
  ],
  node: {
    fs: 'empty'
  }
};

module.exports = config;
