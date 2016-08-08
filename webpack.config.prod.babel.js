import { resolve } from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import failPlugin from 'webpack-fail-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  devtool: 'source-map',
  
  entry: [ './app' ],
  
  resolve: {
    root: [
      resolve('./app'),
    ],
  },
  
  output: {
    path: resolve(__dirname, '..', 'dist'),
    filename: 'bundle.[chunkhash].js',
  },
  
  module: {
    loaders: [
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
        loader: ExtractTextPlugin.extract('style-loader','css?modules&camelCase&sourceMap&localIdentName=[name]_[local]!sass'),
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
  
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    failPlugin,
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new ExtractTextPlugin('style.[chunkhash].css', { allChunks: true }),
    new CopyWebpackPlugin([
      {
        context: 'assets',
        from: '**/*',
        to: resolve(__dirname, '..', 'dist'),
      },
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  
  eslint: {
    emitError: true,
    failOnError: true,
    configFile: '.eslintrc',
    fix: false,
  },
}
