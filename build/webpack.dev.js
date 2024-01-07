const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 5001,
    compress: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
  },
};
