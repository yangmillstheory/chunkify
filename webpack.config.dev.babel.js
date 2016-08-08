import { join, resolve } from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  devtool: 'cheap-module-source-map',
  
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000',
    './app',
  ],
  
  output: {
    path: join(__dirname, 'assets'),
    publicPath: '',
    filename: 'dev-bundle.js',
  },
  
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: '/tmp',
        },
      },
      {
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css?modules&camelCase&sourceMap&localIdentName=[name]_[local]!sass' ],
      },
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  
  resolve: {
    root: [
      resolve(__dirname, './app'),
    ],
  },
  
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    historyApiFallback: true,
    contentBase: './assets',
    host: '0.0.0.0',
    port: '8000',
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ],
  
  eslint: {
    configFile: '.eslintrc',
    fix: true,
  },
}
