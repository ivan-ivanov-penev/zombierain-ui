const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm

module.exports = [
  {
    mode: 'production',
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
  }
];