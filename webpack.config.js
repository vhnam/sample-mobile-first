const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './assets/scss/app.scss',
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/app.min.js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {outputPath: 'css', name: '[name].min.css'},
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
          to: 'webfonts',
        },
      ],
    }),
  ],
};
