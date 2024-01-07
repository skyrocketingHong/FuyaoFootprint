const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('css-minimizer-webpack-plugin');
const TersorWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', (stats) => {
      console.log('stats', stats);
    });
  }
}

module.exports = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({}),
    new DonePlugin(), // 使用新的插件
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new TersorWebpackPlugin(),
    ],
  },
  output: {
    publicPath: '/footprints/',
  },
};
